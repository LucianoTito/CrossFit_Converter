#!/usr/bin/env python3
"""Genera los archivos fuente del icono y la splash de Kalibra.

La marca se dibuja una sola vez en un viewBox de 120 unidades y se escala
desde ahi. Asi no hay versiones del logo que puedan divergir entre si.

Salida en assets/, que es donde @capacitor/assets espera los archivos fuente
para generar despues todas las densidades que pide Android.
"""

import os
import cairosvg

SALIDA = "/tmp/claude-0/-home-claude/c5989666-ea53-5ff9-a2c7-3dded251e1de/scratchpad/kalibra-assets/assets"
os.makedirs(SALIDA, exist_ok=True)

ACENTO = "#e0fd53"
ACENTO_OSCURO = "#8a9c33"
FONDO = "#141414"

# La marca, en coordenadas de 0..120.
#
# Las barras se dibujan como rectangulos y no como lineas con extremo
# redondeado: con linecap round se fundian con el brazo y el conjunto leia
# como una sola forma en L. Separadas por un hueco, se entienden como dos
# medidas apoyadas sobre una referencia comun.
MARCA = f'''
  <rect x="22" y="56" width="76" height="8" rx="4" fill="{ACENTO}"/>
  <rect x="32" y="22" width="12" height="32" rx="3.5" fill="{ACENTO}"/>
  <rect x="76" y="36" width="12" height="18" rx="3.5" fill="{ACENTO}"/>
  <path d="M 60 64 L 51 86 L 69 86 Z" fill="{ACENTO_OSCURO}"/>
'''

# Caja de la marca en coordenadas de 120, contando el grosor de los trazos.
BBOX_X0, BBOX_X1 = 22.0, 98.0
BBOX_Y0, BBOX_Y1 = 22.0, 86.0
BBOX_CX = (BBOX_X0 + BBOX_X1) / 2
BBOX_CY = (BBOX_Y0 + BBOX_Y1) / 2
BBOX_W = BBOX_X1 - BBOX_X0


def svg_marca(lado, ancho_marca, fondo=None, radio=None):
    """Compone la marca centrada en un lienzo cuadrado.

    ancho_marca: cuantos pixeles debe medir la marca de lado a lado.
    """
    escala = ancho_marca / BBOX_W
    tx = lado / 2 - BBOX_CX * escala
    ty = lado / 2 - BBOX_CY * escala

    capa_fondo = ""
    if fondo:
        if radio:
            capa_fondo = (
                f'<rect width="{lado}" height="{lado}" rx="{radio}" fill="{fondo}"/>'
            )
        else:
            capa_fondo = f'<rect width="{lado}" height="{lado}" fill="{fondo}"/>'

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{lado}" height="{lado}" viewBox="0 0 {lado} {lado}">
  {capa_fondo}
  <g transform="translate({tx:.2f},{ty:.2f}) scale({escala:.4f})">{MARCA}</g>
</svg>'''


def escribir(nombre, svg, lado):
    destino = os.path.join(SALIDA, nombre)
    cairosvg.svg2png(
        bytestring=svg.encode("utf-8"),
        write_to=destino,
        output_width=lado,
        output_height=lado,
    )
    print(f"  {nombre}  ({lado}x{lado})")


print("Generando en", SALIDA)

# --- Icono adaptativo -------------------------------------------------------
# Android recorta el icono adaptativo con formas variables segun el lanzador.
# De un lienzo de 108dp solo los 72dp centrales estan garantizados. La marca
# ocupa 620px de 1024 para quedar comoda dentro de esa zona segura (682px).
escribir(
    "icon-foreground.png",
    svg_marca(1024, ancho_marca=620),
    1024,
)

escribir(
    "icon-background.png",
    svg_marca(1024, ancho_marca=0.01, fondo=FONDO),
    1024,
)

# --- Icono plano ------------------------------------------------------------
# Para Android anteriores a 8.0 y para la ficha de Play Store. Aca no hay
# recorte, asi que la marca puede ocupar mas: 700 de 1024.
escribir(
    "icon.png",
    svg_marca(1024, ancho_marca=700, fondo=FONDO),
    1024,
)

# --- Splash -----------------------------------------------------------------
# Lienzo muy grande porque se recorta al centro en cualquier proporcion de
# pantalla. La marca va chica: es una pantalla de arranque, no un cartel.
escribir(
    "splash.png",
    svg_marca(2732, ancho_marca=820, fondo=FONDO),
    2732,
)
escribir(
    "splash-dark.png",
    svg_marca(2732, ancho_marca=820, fondo=FONDO),
    2732,
)

# --- Favicon del sitio ------------------------------------------------------
escribir(
    "favicon-512.png",
    svg_marca(512, ancho_marca=350, fondo=FONDO, radio=96),
    512,
)

# --- SVG suelto, por si hace falta en otro lado -----------------------------
with open(os.path.join(SALIDA, "logo.svg"), "w", encoding="utf-8") as f:
    f.write(svg_marca(512, ancho_marca=350, fondo=FONDO, radio=96))
print("  logo.svg")

print("Listo.")
