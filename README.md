# Recicle Bem

## Levantamento de requisitos

### Entidades

- Users (id, name, email, cpf, password, created_at, updated_at)
- Schools (id, name, city, state, created_at, updated_at)
- Classes (id, name, year, school_id, created_at, updated_at)
- Students (
    id, 
    name, 
    code, 
    cpf, 
    email, 
    password, 
    active, 
    school_id, 
    class_id, 
    created_at, 
    updated_at
  )
- Points (id, student_id, amount, created_at)
- Awards (id, name, description, value, school_id, created_at, updated_at)

### Techs

- Docker (postgresql)
- Banco de dados postgresql
- NodeJS (fastify, swagger, zod)
- ReactJS (vite, zod, rhf, tanstack-query)
- S3 (amazon), R2 na cloudflare

### Fixs

- Testar dirty do salvar do prêmio
- Apagar pasta da escola quando ela for excluída
- Apagar foto do prêmio quando ele for excluído
