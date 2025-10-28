# Astralx — MVP Taller Cerca

Aplicación móvil y backend para conectar propietarios de vehículos con talleres especializados, permitiendo solicitudes de servicio, ofertas inmediatas o con turno, ejecución y valoración. Arquitectura optimizada para un solo developer utilizando React Native (mobile), Nest.js (backend), MySQL y Copilot Agent.

## Objetivo

Facilitar la búsqueda y gestión de servicios automotrices (mecánica, chapa y pintura, electricidad, electrónica, etc.) mediante una plataforma eficiente y escalable.

## Funcionalidades MVP

- **Registro y autenticación**: Email/password, verificación, recuperación de contraseña, roles Cliente/Taller.
- **Perfiles**: Datos personales y legales, especialidades, horarios y capacidad.
- **Catálogo de especialidades**: Selección y búsqueda de servicios.
- **Solicitudes**: Publicación con descripción, fotos, ubicación y preferencias horarias.
- **Matching y ofertas**: Talleres relevantes pueden ofertar ejecución inmediata o proponer turno y presupuesto.
- **Agenda y turnos**: Confirmación de citas, recordatorios automáticos.
- **Chat y mensajería**: Comunicación in-app con adjuntos y notificaciones push.
- **Valoraciones**: Calificación y comentarios tras finalizar el servicio.
- **Geolocalización**: Captura de ubicación, radio de cobertura y cálculo de distancias.
- **Gestión de media**: Subida de fotos/videos a CDN, thumbnails automáticos.
- **Observabilidad**: Logs estructurados, health checks, trazabilidad básica.

## Stack tecnológico

- **Mobile:** React Native (Expo opcional), React Navigation, Hooks, TypeScript
- **Backend:** Nest.js modular monolito, JWT, BullMQ (jobs), TypeORM/Prisma, OpenAPI
- **DB:** MySQL (InnoDB), Redis (caché y colas)
- **Infra:** Docker Compose para dev, S3/MinIO para media, GitHub Actions CI/CD
- **AI:** GitHub Copilot Agent (gpt-5) para scaffolding y generación de código repetitivo
- **Notificaciones:** FCM (Android), APNs (iOS), fallback in-app
- **Geocoding:** Google/Mapbox API (configurable)

## Instalación rápida

```bash
git clone https://github.com/GuilleGlad/Astralx.git
cd Astralx

# Método 1: Automatizado (recomendado)
npm run setup:dev

# Método 2: Manual
npm install
cp .env.example .env
docker-compose up -d
npm run start:api
npm run start:mobile
```

Accede a:

- API: http://localhost:3000/api
- Documentación OpenAPI: http://localhost:3000/api/docs
- MinIO Console: http://localhost:9001

## Estructura del repositorio

```
Astralx/
├── apps/
│   ├── api/              # Backend Nest.js
│   │   └── src/
│   │       ├── app/      # Módulos, controladores, servicios
│   │       └── main.ts   # Punto de entrada con OpenAPI
│   ├── api-e2e/          # Tests E2E del API
│   └── mobile/           # App React Native
│       ├── android/      # Código nativo Android
│       ├── ios/          # Código nativo iOS
│       └── src/          # Código TypeScript/React
├── infra/
│   ├── Dockerfile.api    # Imagen Docker del API
│   ├── init-db.sql       # Schema inicial MySQL
│   ├── setup-dev.sh      # Script de setup automatizado
│   └── generate-api-client.sh  # Generador de cliente TypeScript
├── .github/
│   ├── workflows/
│   │   └── ci-cd.yml     # Pipeline CI/CD
│   └── pull_request_template.md
├── .husky/               # Git hooks (commitlint)
├── docker-compose.yml    # Infraestructura completa
├── nx.json               # Configuración Nx
└── package.json          # Scripts y dependencias
```

## Flujos principales

1. **Cliente publica solicitud** → Talleres relevantes reciben notificación y ofrecen solución → Cliente acepta oferta → Se agenda turno → Chat y ejecución → Valoración final.
2. **Taller gestiona ofertas y agenda** → Visualiza solicitudes por especialidad y radio → Propone presupuesto y turno → Ejecuta trabajo → Recibe valoración.

## Roadmap MVP

- ✅ Sprint 0: Infraestructura y productividad inicial
- ✅ Sprint 1: Autenticación y shell móvil
  - Backend: Registro, login, verificación de email, recuperación de contraseña, JWT + refresh tokens, RBAC
  - Mobile: Navegación, theming, gestión de sesión, formularios de auth
- Sprints siguientes: Solicitudes, matching, agenda, chat, notificaciones, valoraciones, media y flujos QA.

## Estado del Proyecto

### Completado (Sprint 1)

**Backend API:**

- ✅ Sistema de autenticación completo (registro, login, JWT)
- ✅ Verificación por email con tokens temporales
- ✅ Recuperación de contraseña
- ✅ Refresh tokens con rotación automática
- ✅ RBAC (Cliente/Taller/Admin)
- ✅ Logs estructurados con trazabilidad
- ✅ Manejo global de errores
- ✅ Validación de entrada en todos los endpoints
- ✅ OpenAPI/Swagger documentation

**Aplicación Móvil:**

- ✅ Navegación completa (Auth stack, Main tabs)
- ✅ Sistema de theming consistente
- ✅ Gestión de sesión persistente (AsyncStorage)
- ✅ Pantallas de login y registro con validación
- ✅ Pantalla de recuperación de contraseña
- ✅ Pantalla de perfil
- ✅ Auto-refresh de tokens JWT
- ✅ Manejo de estados de carga y errores
- ✅ Soporte de accesibilidad (screen readers)

### En Progreso

- Documentación de API extendida
- Tests unitarios y E2E

### Próximos Pasos

- Sprint 2: Perfiles y catálogo de especialidades
- Sprint 3: Sistema de solicitudes y matching

## Contribución

1. Clona el repo y crea tu rama feature.
2. Sigue las convenciones de commit y PR (plantillas incluidas).
3. Usa Copilot Agent para acelerar scaffolding y generación de tests.
4. Corre los tests y lint antes de enviar PR.

## Licencia

MIT

---

> Proyecto desarrollado por [@GuilleGlad](https://github.com/GuilleGlad) — MVP acelerado con Copilot Agent y gpt-5.
