#!/bin/bash

# ==========================================
# Event Gallery - S3 Setup Script
# ==========================================
# Este script configura el bucket S3 para Event Gallery
# Requisitos: AWS CLI instalado y configurado
# ==========================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuración
BUCKET_NAME="${S3_BUCKET_NAME:-event-gallery-images}"
AWS_REGION="${AWS_REGION:-us-east-1}"

echo -e "${GREEN}=========================================="
echo "Event Gallery - S3 Setup"
echo -e "==========================================${NC}"
echo ""
echo "Bucket Name: $BUCKET_NAME"
echo "Region: $AWS_REGION"
echo ""

# Verificar AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI no está instalado${NC}"
    echo "Instalar: https://aws.amazon.com/cli/"
    exit 1
fi

# Verificar credenciales
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS CLI no está configurado correctamente${NC}"
    echo "Ejecutar: aws configure"
    exit 1
fi

echo -e "${GREEN}✓ AWS CLI configurado correctamente${NC}"
echo ""

# Crear bucket
echo -e "${YELLOW}Creando bucket S3...${NC}"
if aws s3 mb s3://$BUCKET_NAME --region $AWS_REGION 2>/dev/null; then
    echo -e "${GREEN}✓ Bucket creado: s3://$BUCKET_NAME${NC}"
else
    echo -e "${YELLOW}⚠ Bucket ya existe o error al crear${NC}"
fi

# Habilitar versionado
echo -e "${YELLOW}Habilitando versionado...${NC}"
aws s3api put-bucket-versioning \
    --bucket $BUCKET_NAME \
    --versioning-configuration Status=Enabled \
    --region $AWS_REGION
echo -e "${GREEN}✓ Versionado habilitado${NC}"

# Configurar CORS
echo -e "${YELLOW}Configurando CORS...${NC}"
aws s3api put-bucket-cors \
    --bucket $BUCKET_NAME \
    --cors-configuration file://db/s3-setup/cors-config.json \
    --region $AWS_REGION
echo -e "${GREEN}✓ CORS configurado${NC}"

# Aplicar política de bucket
echo -e "${YELLOW}Aplicando política de bucket...${NC}"
# Primero, reemplazar el nombre del bucket en la política
sed "s/event-gallery-images/$BUCKET_NAME/g" db/s3-setup/bucket-policy.json > /tmp/bucket-policy-temp.json
aws s3api put-bucket-policy \
    --bucket $BUCKET_NAME \
    --policy file:///tmp/bucket-policy-temp.json \
    --region $AWS_REGION
rm /tmp/bucket-policy-temp.json
echo -e "${GREEN}✓ Política de bucket aplicada${NC}"

# Configurar lifecycle policy
echo -e "${YELLOW}Configurando políticas de ciclo de vida...${NC}"
aws s3api put-bucket-lifecycle-configuration \
    --bucket $BUCKET_NAME \
    --lifecycle-configuration file://db/s3-setup/lifecycle-policy.json \
    --region $AWS_REGION
echo -e "${GREEN}✓ Políticas de ciclo de vida configuradas${NC}"

# Bloquear acceso público (excepto GetObject)
echo -e "${YELLOW}Configurando acceso público...${NC}"
aws s3api put-public-access-block \
    --bucket $BUCKET_NAME \
    --public-access-block-configuration \
        "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=false,RestrictPublicBuckets=false" \
    --region $AWS_REGION
echo -e "${GREEN}✓ Acceso público configurado${NC}"

# Crear estructura de carpetas
echo -e "${YELLOW}Creando estructura de carpetas...${NC}"
aws s3api put-object --bucket $BUCKET_NAME --key events/ --region $AWS_REGION > /dev/null
aws s3api put-object --bucket $BUCKET_NAME --key avatars/ --region $AWS_REGION > /dev/null
echo -e "${GREEN}✓ Estructura de carpetas creada${NC}"

# Obtener información del bucket
BUCKET_URL="https://$BUCKET_NAME.s3.$AWS_REGION.amazonaws.com"
echo ""
echo -e "${GREEN}=========================================="
echo "✓ Configuración completada exitosamente"
echo "==========================================${NC}"
echo ""
echo "URL del bucket: $BUCKET_URL"
echo ""
echo "Agregar estas variables a tu archivo .env:"
echo ""
echo "S3_BUCKET_NAME=$BUCKET_NAME"
echo "AWS_REGION=$AWS_REGION"
echo "S3_BUCKET_URL=$BUCKET_URL"
echo ""
echo -e "${YELLOW}Próximos pasos:${NC}"
echo "1. Configurar CloudFront (opcional pero recomendado)"
echo "2. Crear usuario IAM con la política en db/s3-setup/iam-policy.json"
echo "3. Agregar las credenciales IAM a .env"
echo ""

