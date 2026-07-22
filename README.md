# 🏋️ CrossFit Converter

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

Aplicación web para **convertir las unidades de un WOD** y calcular porcentajes de carga, pensada para usarse desde el celular en pleno gimnasio.

**🌐 [English](#-english) · [Español](#-español)**

> 🔗 **Demo en vivo:** [crossfitconverter.netlify.app](https://crossfitconverter.netlify.app/)

---

## 🇦🇷 Español

### 💡 El problema que resuelve

Los entrenamientos (WODs) que me mandaban venían en **unidades americanas** — libras, millas, calorías — pero yo entreno en **sistema métrico** (kilos, metros). En vez de estar convirtiendo a mano en cada sesión, construí una herramienta que lo hace al instante desde el celular, en el gimnasio.

### ✨ Funcionalidades

La app agrupa **cuatro conversores** en tarjetas independientes:

- 📊 **Calculadora de porcentajes de carga** — calcula el porcentaje de un peso (por ejemplo, el 70 % de tu RM) para escalar los movimientos del WOD.
- ⚖️ **Conversor de peso** — libras ↔ kilogramos.
- 🔥 **Conversor de calorías** — para las máquinas que miden el esfuerzo en calorías (remo, assault bike).
- 📏 **Conversor de longitud** — millas ↔ metros, para carreras y remos.

Incluye además un botón de "volver arriba" para navegar cómodo entre las tarjetas.

### 🛠️ Stack Tecnológico

| Área | Tecnología |
|---|---|
| Librería | React 18 |
| Bundler / Dev server | Vite 5 (plugin SWC) |
| Iconos | react-icons |
| Estilos | CSS3 (diseño responsivo, mobile-first) |
| Calidad de código | ESLint (config Standard) |
| Hosting | Netlify |

### 📂 Estructura del Proyecto

```
├── index.html
├── src/
│   ├── main.jsx                  # Punto de entrada de React
│   ├── App.jsx                   # Compone las 4 tarjetas de conversión
│   ├── App.css / index.css       # Estilos globales
│   └── components/
│       └── pages/
│           ├── WeightPercentageCalculator.jsx
│           ├── ConversorWeightCard.jsx
│           ├── ConversorCalsCard.jsx
│           └── LengthConverterCard.jsx
└── vite.config.js
```

### 🚀 Ejecutar Localmente

```bash
git clone https://github.com/LucianoTito/CrossFit_Converter.git
cd CrossFit_Converter
npm install
npm run dev
```

Luego abrí la URL local que muestra Vite (por defecto `http://localhost:5173`).

---

## 🇬🇧 English

### 💡 The problem it solves

The workouts (WODs) I received came in **US units** — pounds, miles, calories — but I train in the **metric system** (kilos, meters). Instead of converting by hand every session, I built a tool that does it instantly from my phone, right at the gym.

### ✨ Features

The app bundles **four converters** as independent cards:

- 📊 **Load percentage calculator** — computes a percentage of a given weight (e.g. 70 % of your 1RM) to scale WOD movements.
- ⚖️ **Weight converter** — pounds ↔ kilograms.
- 🔥 **Calorie converter** — for machines that measure effort in calories (rower, assault bike).
- 📏 **Length converter** — miles ↔ meters, for runs and rows.

It also includes a "back to top" button for comfortable navigation between cards.

### 🛠️ Tech Stack

| Area | Technology |
|---|---|
| Library | React 18 |
| Bundler / Dev server | Vite 5 (SWC plugin) |
| Icons | react-icons |
| Styles | CSS3 (responsive, mobile-first) |
| Code quality | ESLint (Standard config) |
| Hosting | Netlify |

### 🚀 Run Locally

```bash
git clone https://github.com/LucianoTito/CrossFit_Converter.git
cd CrossFit_Converter
npm install
npm run dev
```

Then open the local URL Vite prints (default `http://localhost:5173`).

---

## 👤 Autor

**Luciano Facundo Tito Cedrón** — Backend Developer Jr. · .NET

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/luciano-tito-cedron)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/LucianoTito)
