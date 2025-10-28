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
# Inicializa monorepo y dependencias
npm install
# Levanta infraestructura local
docker-compose up -d
# Arranca backend y mobile en modo dev
npm run start:api
npm run start:mobile
```

## Estructura del repositorio

- `/api` — Backend Nest.js (servicios, módulos, entidades, jobs)
- `/mobile` — App React Native (pantallas, hooks, navegación)
- `/infra` — Archivos Docker, scripts de setup, configuración de Copilot Agent

## Flujos principales

1. **Cliente publica solicitud** → Talleres relevantes reciben notificación y ofrecen solución → Cliente acepta oferta → Se agenda turno → Chat y ejecución → Valoración final.
2. **Taller gestiona ofertas y agenda** → Visualiza solicitudes por especialidad y radio → Propone presupuesto y turno → Ejecuta trabajo → Recibe valoración.

## Roadmap MVP

- Sprint 0: Infraestructura y productividad inicial
- Sprint 1: Autenticación y shell móvil
- Sprints siguientes: Solicitudes, matching, agenda, chat, notificaciones, valoraciones, media y flujos QA.

## Contribución

1. Clona el repo y crea tu rama feature.
2. Sigue las convenciones de commit y PR (plantillas incluidas).
3. Usa Copilot Agent para acelerar scaffolding y generación de tests.
4. Corre los tests y lint antes de enviar PR.

## Licencia

MIT

---

> Proyecto desarrollado por [@GuilleGlad](https://github.com/GuilleGlad) — MVP acelerado con Copilot Agent y gpt-5.
