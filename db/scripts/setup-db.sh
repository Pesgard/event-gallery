#!/bin/bash

# ==========================================
# Event Gallery - Database Setup Script
# ==========================================
# Este script configura la base de datos PostgreSQL
# ==========================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuración
DB_NAME="${DB_NAME:-event_gallery}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

echo -e "${GREEN}=========================================="
echo "Event Gallery - Database Setup"
echo -e "==========================================${NC}"
echo ""
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Host: $DB_HOST"
echo "Port: $DB_PORT"
echo ""

# Verificar PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${RED}Error: PostgreSQL no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✓ PostgreSQL encontrado${NC}"
echo ""

# Verificar si la base de datos existe
if psql -U $DB_USER -h $DB_HOST -p $DB_PORT -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo -e "${YELLOW}⚠ La base de datos '$DB_NAME' ya existe${NC}"
    read -p "¿Deseas continuar y aplicar migraciones? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Operación cancelada"
        exit 1
    fi
else
    # Crear base de datos
    echo -e "${YELLOW}Creando base de datos...${NC}"
    psql -U $DB_USER -h $DB_HOST -p $DB_PORT -c "CREATE DATABASE $DB_NAME;"
    echo -e "${GREEN}✓ Base de datos creada${NC}"
fi

# Aplicar migración
echo -e "${YELLOW}Aplicando esquema...${NC}"
psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -f db/migrations/001_initial_schema.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Esquema aplicado exitosamente${NC}"
else
    echo -e "${RED}✗ Error al aplicar esquema${NC}"
    exit 1
fi

# Verificar tablas
echo -e "${YELLOW}Verificando tablas...${NC}"
TABLE_COUNT=$(psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';")
echo -e "${GREEN}✓ Tablas creadas: $TABLE_COUNT${NC}"

# Verificar funciones
echo -e "${YELLOW}Verificando funciones...${NC}"
FUNCTION_COUNT=$(psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -t -c "SELECT COUNT(*) FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');")
echo -e "${GREEN}✓ Funciones creadas: $FUNCTION_COUNT${NC}"

# Generar string de conexión
CONNECTION_STRING="postgresql://$DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"

echo ""
echo -e "${GREEN}=========================================="
echo "✓ Configuración completada exitosamente"
echo "==========================================${NC}"
echo ""
echo "Connection string para .env:"
echo ""
echo "DATABASE_URL=\"$CONNECTION_STRING\""
echo ""
echo -e "${YELLOW}Próximos pasos:${NC}"
echo "1. Agregar DATABASE_URL a tu archivo .env"
echo "2. Ejecutar: pnpm db:studio (para visualizar la BD)"
echo "3. Configurar AWS S3 con: bash db/scripts/setup-s3.sh"
echo ""

