pipeline {
    agent any

    tools {
        nodejs 'node18' 
    }

    environment {
        DOCKERHUB_USER = "sadishaws"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/ai-saas-frontend"
        BACKEND_IMAGE  = "${DOCKERHUB_USER}/ai-saas-backend"
        IMAGE_TAG      = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/awssadish/Cloud-Native-Microservices-CI-CD-Platform-with-Observability-Auto-Scaling.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    cd server
                    npm install
                '''
            }
        }

        stage('Build Application') {
            steps {
                sh '''
                    cd server
                    npm run build || echo "No build script found"
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'sonar-scanner'
                    withSonarQubeEnv('SonarQubeServer') {
                        sh """
                            cd server
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=ai-saas \
                            -Dsonar.sources=.
                        """
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
               timeout(time: 2, unit: 'MINUTES') {
                   waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                withCredentials([string(credentialsId: 'nvd-api-key', variable: 'NVD_KEY')]) {
                    dependencyCheck additionalArguments: """
                        --scan ./server
                        --format XML
                        --out .
                        --nvdApiKey $NVD_KEY
                    """,
                    odcInstallation: 'DP'
                }

                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
        stage('Trivy Filesystem Scan') {
            steps {
                sh '''
                    trivy fs . \
                    --severity HIGH,CRITICAL \
                    --format template \
                    --template "@/usr/local/share/trivy/templates/html.tpl" \
                    --output trivy-report.html \
                    --no-progress
                '''
            }
        }
        stage('Trivy Secret Scan') {
            steps {
                sh '''
                    trivy fs . \
                    --scanners secret \
                    --severity HIGH,CRITICAL \
                    --no-progress
                '''
            }
        }
        stage('Build Docker Images') {
            steps {
                sh '''
                    set -e

                    docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} -f client/Dockerfile client
                    docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${FRONTEND_IMAGE}:latest

                    docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} -f server/Dockerfile server
                    docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${BACKEND_IMAGE}:latest

                    
                '''
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                withDockerRegistry(
                    credentialsId: 'docker-creds',
                    url: 'https://index.docker.io/v1/'
                ) {
                    sh '''
                        docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                        docker push ${FRONTEND_IMAGE}:latest
                        docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                        docker push ${BACKEND_IMAGE}:latest
                        
                    '''
                }
            }
        }
        stage('Trivy Image Scan') {
            steps {
                sh '''
                    trivy image ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    --no-progress

                    trivy image ${BACKEND_IMAGE}:${IMAGE_TAG} \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    --no-progress
                '''
            }
        }
        stage('Deploy Update to EKS') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creds'
                ]]) {
                    sh '''
                        # Connect to EKS cluster
                        aws eks --region eu-north-1 update-kubeconfig --name project-one-cluster

                        # Update backend deployment image
                        kubectl set image deployment/ai-saas-backend \
                        backend=${BACKEND_IMAGE}:${IMAGE_TAG} \
                        -n aisaas

                        # Update frontend deployment image
                        kubectl set image deployment/ai-saas-frontend \
                        frontend=${FRONTEND_IMAGE}:${IMAGE_TAG} \
                        -n aisaas

                        # Wait for rollout (zero downtime deployment)
                        kubectl rollout status deployment/ai-saas-backend -n aisaas
                        kubectl rollout status deployment/ai-saas-frontend -n aisaas
                    '''
                }
            }
        }
    }

    post {
    success {
        echo "✅ Build ${BUILD_NUMBER} completed successfully"
    }
    failure {
        echo "❌ Build ${BUILD_NUMBER} failed"
    }
    always {
        publishHTML(target: [
            reportDir: '.',
            reportFiles: 'trivy-report.html',
            reportName: 'Trivy Security Report',
            keepAll: true,
            alwaysLinkToLastBuild: true,
            allowMissing: true
        ])
        cleanWs()
    }
    }
}