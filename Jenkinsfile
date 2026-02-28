pipeline {
    agent any 

    tools {
        jdk 'jdk11'
        maven 'maven3'
    }

    environment {
        DOCKERHUB_USER = "sadishaws"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/AI-Saas-frontend"
        BACKEND_IMAGE  = "${DOCKERHUB_USER}/AI-SaaS-backend"
        IMAGE_TAG      = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/awssadish/Cloud-Native-Microservices-CI-CD-Platform-with-Observability-Auto-Scaling.git'
            }
        }

        stage('Compile') {
            steps {
                sh 'mvn -f server/pom.xml clean compile'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQubeServer') {
                    sh '''
                        mvn -f server/pom.xml sonar:sonar \
                        -Dsonar.projectKey=AI-Saas \
                        -Dsonar.projectName=AI-Saas
                    '''
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

        stage('OWASP Dependency Scan') {
            steps {
                dependencyCheck additionalArguments: '--scan ./', odcInstallation: 'DP'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }

        stage('Build') {
            steps {
                sh 'mvn -f server/pom.xml clean install'
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
                    trivy image --exit-code 1 --severity CRITICAL,HIGH ${FRONTEND_IMAGE}:${IMAGE_TAG}
                    trivy image --exit-code 1 --severity CRITICAL,HIGH ${BACKEND_IMAGE}:${IMAGE_TAG}
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
    }

    post {
        success {
            echo "Build ${BUILD_NUMBER} completed successfully"
        }
        failure {
            echo "Build ${BUILD_NUMBER} failed"
        }
        always {
            cleanWs()
        }
    }
}