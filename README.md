<div align="center">

![Crevolution](https://img.shields.io/badge/Crevolution-Hackatón_2026-blue?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Fintech](https://img.shields.io/badge/Fintech-Risk--as--a--Service-8B5CF6?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Prototipo_Interactivo-FF5E36?style=for-the-badge)

<br/>

<img src="assets/logo.svg" alt="LogScore Logo" width="200"/>

# LogScore — Diario Financiero Inteligente

> *"Un diario financiero que no confía en lo que el usuario promete tener, sino en lo que demuestra empíricamente que puede sostener."*

**Propuesta oficial de ITICsLab para el Crevolution Hackatón 2026**

</div>

---

## Descripción

**LogScore** es una plataforma y prototipo interactivo de inclusión financiera desarrollado por el equipo **ITICsLab**. Su objetivo es transformar los hábitos cotidianos en una **reputación financiera verificable** para sectores excluidos del sistema bancario tradicional (estudiantes, trabajadores independientes, microemprendedores y personas sin historial en buró de crédito).

Mediante un enfoque de **colateral conductual** y **evaluación no convencional de riesgos**, el sistema permite registrar ingresos y gastos por lenguaje natural u OCR local, cumplir misiones de ahorro y generar un expediente pre-evaluado respaldado por certificaciones académicas y autenticación continua.

---

## Objetivo y Propuesta de Valor

**Objetivo general:** diseñar un sistema integral de reputación financiera alternativa que conecte a usuarios no bancarizados con instituciones financieras mediante un modelo **Risk-as-a-Service (RaaS)**, reduciendo la asimetría de información y el riesgo de impago.

### Audiencias objetivo

| B2C — Usuarios finales | B2B — Instituciones financieras |
|---|---|
| **Jóvenes y universitarios (18-25 años):** acceso a su primer crédito sin aval ni historial previo. | **Risk-as-a-Service (RaaS):** API y expedientes pre-evaluados con scoring multidimensional. |
| **Economía informal y freelance:** validación de capacidad de pago mediante flujos reales y consistencia de hábitos. | **Reducción de cartera vencida y fraude:** detección temprana de inconsistencias y verificación de identidad continua. |
| **Personas en recuperación crediticia:** mecanismos guiados para sanear finanzas mediante misiones y pruebas de estrés. | **Adquisición de clientes de bajo riesgo:** conexión con perfiles disciplinados y capacitados financieramente. |

---

## Variables No Convencionales Evaluadas

LogScore trasciende el modelo tradicional de scoring bancario analizando variables conductuales empíricas con estricto apego a la privacidad.

| Dimensión | Variable analizada | Impacto en el score |
|---|---|---|
| Estabilidad de rutinas | Geolocalización y patrones de movilidad anonimizados (sin GPS exacto). | Evalúa regularidad y consistencia en la rutina diaria. |
| Consumo y gastos | Escaneo OCR local de comprobantes y tickets. | Extrae montos, comercio y clasifica gastos (esenciales vs. hormiga). |
| Disciplina financiera | Misiones de ahorro sostenido y pruebas de estrés. | Actúa como colateral conductual demostrable. |
| Capacitación (Proof of Knowledge) | Bóveda de credenciales académicas (CONDUSEF, Banxico, CNBV). | Bonificación de puntaje por educación y prevención de fraudes. |
| Huella digital voluntaria | Análisis semántico opcional de suscripciones y herramientas de productividad. | Distingue inversión en desarrollo vs. ocio desmedido. |
| Antifraude continuo | Sello de identidad verificada tras 90 días de actividad regular. | Garantiza que la cuenta pertenece al titular y previene suplantaciones. |

---

## Arquitectura del Sistema

```mermaid
graph TD
    classDef client fill:#e0f0fe,stroke:#2563eb,stroke-width:2px,color:#0f172a
    classDef edge fill:#ecfdf5,stroke:#10b981,stroke-width:2px,color:#065f46
    classDef privacy fill:#f3e8ff,stroke:#8b5cf6,stroke-width:2px,color:#4c1d95
    classDef engine fill:#fff7ed,stroke:#f97316,stroke-width:2px,color:#7c2d12
    classDef b2b fill:#fef2f2,stroke:#ef4444,stroke-width:2px,color:#7f1d1d

    subgraph FrontEnd ["Capa de Cliente"]
        A1["Landing Page Oficial<br/>(index.html)"]
        A2["Interactive Device Viewer<br/>(interactive-demo-viewer.html)"]
        A3["Mockup App Móvil<br/>(page1 a page6)"]
    end

    subgraph EdgeProcessing ["Procesamiento Local (Edge AI / OCR)"]
        B1["Cámara y Escaneo OCR<br/>Extracción de tickets en el dispositivo"]
        B2["Asistente Conversacional<br/>Registro en lenguaje natural"]
    end

    subgraph PrivacyConsent ["Privacidad y Consentimiento (INAI / LFPDPPP)"]
        C1["Consentimiento Granular<br/>Opt-In / Opt-Out por variable"]
        C2["Anonimización en Origen<br/>Sin texto crudo ni GPS exacto"]
    end

    subgraph ScoringCore ["Motor de Reputación LogScore"]
        D1["LogScore Gauge<br/>Puntaje dinámico (300 a 850+ pts)"]
        D2["Misiones y Pruebas de Estrés<br/>Ahorro como colateral conductual"]
        D3["Bóveda Académica<br/>Validación CONDUSEF / Banxico / CNBV"]
    end

    subgraph B2BIntegration ["Ecosistema B2B (Risk-as-a-Service)"]
        E1["Certificado de Reputación Conductual<br/>Expediente pre-evaluado"]
        E2["Instituciones Financieras<br/>SOFOMes · SOFIPOs · Fintechs"]
    end

    A1 --> A2
    A2 --> A3
    A3 --> B1 & B2
    B1 & B2 --> C1
    C1 --> C2
    C2 --> D1
    D2 & D3 --> D1
    D1 --> E1
    E1 --> E2

    class A1,A2,A3 client
    class B1,B2 edge
    class C1,C2 privacy
    class D1,D2,D3 engine
    class E1,E2 b2b