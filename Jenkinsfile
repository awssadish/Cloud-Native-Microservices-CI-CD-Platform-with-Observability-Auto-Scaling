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

        stage('Install & Build (Parallel)') {
            parallel {

                stage('Backend Build') {
                    steps {
                        sh '''
                            cd server
                            npm install
                            npm run build || echo "No build script found"
                        '''
                    }
                }

                stage('Frontend Build') {
                    steps {
                        sh '''
                            cd client
                            npm install
                            npm run build || echo "No build script found"
                        '''
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'sonar-scanner'
                    withSonarQubeEnv('SonarQubeServer') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=ai-saas \
                            -Dsonar.sources=server,client
                        """
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                withCredentials([string(credentialsId: 'nvd-api-key', variable: 'NVD_KEY')]) {
                    dependencyCheck additionalArguments: """
                        --scan .
                        --format XML
                        --out .
                        --nvdApiKey $NVD_KEY
                    """,
                    odcInstallation: 'DP'
                }

                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
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

        stage('Trivy Image Scan') {
            steps {
                sh '''
                    trivy image ${FRONTEND_IMAGE}:${IMAGE_TAG} || true
                    trivy image ${BACKEND_IMAGE}:${IMAGE_TAG} || true
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

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl apply -f k8s/
                '''
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
            cleanWs()
        }
    }
}