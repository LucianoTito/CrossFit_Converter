# ⚖️ Kalibra

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF?style=flat&logo=capacitor&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=flat&logo=android&logoColor=white)
![Tests](https://img.shields.io/badge/tests-104%20passing-brightgreen?style=flat)

**Equivalencias de entrenamiento**, en la web y en Android. Convierte esfuerzos entre máquinas, calcula porcentajes de carga y estima tiempos de carrera. Pensada para usarse desde el celular, con una mano, en pleno gimnasio.

**🌐 [English](#-english) · [Español](#-español)**

> 🔗 **Demo en vivo:** [crossfitconverter.netlify.app](https://crossfitconverter.netlify.app/)

---

## 🇦🇷 Español

### 💡 El problema que resuelve

Los entrenamientos que me mandaban venían en **unidades americanas** —libras, millas, calorías— pero yo entreno en **sistema métrico**. Y hay un problema más profundo que las unidades: cuando un WOD pide 400 m de carrera y el box tiene las cintas ocupadas, ¿cuántos metros de remo equivalen? ¿Y en Assault Bike? Esa equivalencia no es una regla de tres: depende de la máquina y del género.

Kalibra resuelve las dos cosas en el teléfono, al instante.

### ✨ Funcionalidades

**Cinco herramientas** en tarjetas independientes:

- ⚖️ **Calculadora de porcentajes** — el 70 % de tu RM para escalar cargas, con botones de 50 a 95 % para no escribir a mano.
- 🏋️ **Conversor de peso** — libras ↔ kilogramos.
- 🔄 **Conversor de calorías y metros** — equivalencias entre carrera, Rower/SkiErg, BikeErg, Assault Bike y Echo Bike, en metros o calorías, diferenciadas por género.
- ⏱️ **Pacing de carrera** — ingresás un ritmo y te da los tiempos de 100 m a 5 km. Podés cargarlo por 100 m o por kilómetro.
- 📏 **Conversor de longitud** — metros, kilómetros, centímetros, pulgadas, pies, yardas y millas.

Además: conversión en vivo sin botón, intercambio de origen y destino con un toque, copiar el resultado al portapapeles, **tiempo esperado** para cada distancia, y las preferencias se recuerdan entre sesiones.

### 📊 De dónde salen los datos

Todas las equivalencias provienen de una **única fuente**: el chart oficial [CrossFit Affiliate Programming — Machine Conversions](https://assets.crossfit.com/affiliates/CAP_CardioConversionCharts_v.1.pdf), páginas 1 (pacing), 3 (calorías) y 4 (metros).

Que sea una sola fuente no es un detalle: las conversiones cruzan cualquier actividad contra cualquier otra, así que mezclar escalas de distintos charts produce resultados incoherentes.

Los tests comparan contra **los números impresos del PDF**, no contra proporciones derivadas, de modo que cualquier retoque de los datos obligue a volver a la fuente.

### 🧪 Tests

```bash
npm test
```

104 tests sobre el runner nativo de Node, sin dependencias adicionales. Cubren:

- La invariante estructural de los datos: todos los arrays alineados por índice. Un elemento de más o de menos desalinea todas las conversiones desde ese punto.
- Un barrido que recorre **todas** las combinaciones de origen y destino verificando que ninguna devuelva `NaN`.
- Coincidencia valor por valor con el chart oficial.
- Regresiones de los bugs que tenían los datos originales.

### 🔒 Seguridad y privacidad

- **Cero permisos** en el manifiesto de Android. La app corre entera offline y el sistema operativo lo garantiza.
- **Sin llamadas de red**: la tipografía va empaquetada en lugar de pedirse a Google en cada arranque.
- **Sin backup automático** a la nube ni transferencia entre dispositivos.
- **R8** activado en release: elimina código sin usar y ofusca el resto.

### 🛠️ Stack

| Área | Tecnología |
|---|---|
| Librería | React 18 |
| Bundler | Vite 5 (plugin SWC) |
| App móvil | Capacitor 8 (Android) |
| Tipografía | @fontsource/roboto-mono (local) |
| Iconos | react-icons |
| Estilos | CSS con custom properties, `clamp()`, safe areas |
| Tests | Runner nativo de Node |
| Hosting web | Netlify |

### 📂 Estructura

```
├── android/                      # Proyecto nativo generado por Capacitor
├── assets/                       # Fuentes del ícono y la splash
├── tools/
│   └── gen-iconos.py             # Genera todos los tamaños del logo
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css                 # Tokens de diseño y reset
│   ├── App.css                   # Layout y patrón de tarjeta
│   ├── hooks/
│   │   ├── usePreferencia.js     # Persistencia y portapapeles
│   │   └── useSalirDeLaApp.js    # Botón atrás de Android
│   └── components/
│       ├── logic_conversion/     # Lógica pura, con sus tests
│       ├── pages/                # Las cinco tarjetas
│       └── styles/
└── capacitor.config.json
```

### 🚀 Ejecutar localmente

```bash
git clone https://github.com/LucianoTito/CrossFit_Converter.git
cd CrossFit_Converter
npm install
npm run dev
```

### 📱 Compilar para Android

Requiere Android Studio con el SDK instalado.

```bash
npm run build
npx cap sync
npx cap open android
```

Para generar el paquete de release hace falta un keystore propio y un archivo `android/keystore.properties` con sus credenciales, que **no** está en el repositorio:

```properties
storeFile=/ruta/a/tu-keystore.jks
keyAlias=tu-alias
storePassword=...
keyPassword=...
```

```bash
cd android && ./gradlew bundleRelease assembleRelease
```

### 🎨 El logo

El ícono se define una sola vez en `tools/gen-iconos.py` y de ahí salen todos los tamaños. Los PNG de `assets/` son derivados: para cambiar el logo se edita el script y se regenera, en lugar de editar veinte archivos a mano.

---

## 🇬🇧 English

### 💡 The problem it solves

The workouts I received came in **US units** — pounds, miles, calories — while I train in the **metric system**. And there is a deeper problem than units: when a WOD calls for a 400 m run and the treadmills are taken, how many meters on the rower are equivalent? What about the Assault Bike? That equivalence is not simple arithmetic — it depends on the machine and on gender.

Kalibra answers both, instantly, from your phone.

### ✨ Features

**Five tools** as independent cards:

- ⚖️ **Percentage calculator** — 70 % of your 1RM to scale loads, with 50–95 % shortcut buttons.
- 🏋️ **Weight converter** — pounds ↔ kilograms.
- 🔄 **Calories and meters converter** — equivalences across running, Rower/SkiErg, BikeErg, Assault Bike and Echo Bike, in meters or calories, split by gender.
- ⏱️ **Run pacing** — enter a pace and get times from 100 m to 5 km, per 100 m or per kilometer.
- 📏 **Length converter** — meters, kilometers, centimeters, inches, feet, yards and miles.

Plus: live conversion with no button, one-tap swap of source and target, copy to clipboard, **expected time domain** for each distance, and preferences that persist across sessions.

### 📊 Where the data comes from

Every equivalence comes from a **single source**: the official [CrossFit Affiliate Programming — Machine Conversions](https://assets.crossfit.com/affiliates/CAP_CardioConversionCharts_v.1.pdf) chart, pages 1 (pacing), 3 (calories) and 4 (meters).

One source is not a detail: conversions cross any activity against any other, so mixing scales from different charts yields incoherent results.

Tests assert against **the numbers printed in the PDF**, not against derived ratios, so any tweak to the data forces a trip back to the source.

### 🧪 Tests

```bash
npm test
```

104 tests on Node's native runner, no extra dependencies. They cover the structural invariant of the data (all arrays index-aligned), a sweep over **every** source-to-target combination checking for `NaN`, value-by-value agreement with the official chart, and regressions for the bugs the original data had.

### 🔒 Security and privacy

- **Zero permissions** in the Android manifest. The app runs fully offline and the OS enforces it.
- **No network calls**: the typeface ships with the app instead of being fetched from Google on every launch.
- **No cloud backup** or device transfer.
- **R8** enabled for release builds.

### 🚀 Run locally

```bash
git clone https://github.com/LucianoTito/CrossFit_Converter.git
cd CrossFit_Converter
npm install
npm run dev
```

### 📱 Build for Android

```bash
npm run build
npx cap sync
npx cap open android
```

Release builds need your own keystore and an `android/keystore.properties` file, which is **not** in the repository.

---

## 👤 Autor

**Luciano Facundo Tito Cedrón** — Backend Developer Jr. · .NET

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/luciano-tito-cedron)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/LucianoTito)
