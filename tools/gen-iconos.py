#!/usr/bin/env python3
"""Genera todos los iconos de Kalibra a partir de una unica definicion.

La marca se dibuja una sola vez en un viewBox de 120 unidades y se escala
desde ahi. Asi no hay versiones del logo que puedan divergir entre si: para
cambiar el logo se edita MARCA y se vuelve a correr este script.

Uso, desde la raiz del repositorio:

    pip install cairosvg
    python tools/gen-iconos.py

Salidas:
  assets/   fuentes que @capacitor/assets convierte en las densidades de
            Android. Despues de regenerarlas:

                npx @capacitor/assets generate --android

            Se corre con npx a proposito, sin instalarla en el proyecto: la
            herramienta trae adentro una version vieja de la CLI de Capacitor
            con una dependencia (tar 6) que tiene vulnerabilidades criticas.
            Con npx se descarga a un cache temporal solo cuando hace falta,
            que es unicamente al cambiar el logo.
  public/   favicon e iconos de la PWA, que Vite copia tal cual al build
"""

from pathlib import Path

import cairosvg

# Rutas relativas a la ubicacion del script, no al directorio desde donde se
# lo invoca: funciona igual corrido desde la raiz, desde tools/ o desde un IDE.
RAIZ = Path(__file__).resolve().parent.parent
ASSETS = RAIZ / "assets"
PUBLIC = RAIZ / "public"

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
        rx = f' rx="{radio}"' if radio else ""
        capa_fondo = f'<rect width="{lado}" height="{lado}"{rx} fill="{fondo}"/>'

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{lado}" height="{lado}" viewBox="0 0 {lado} {lado}">
  {capa_fondo}
  <g transform="translate({tx:.2f},{ty:.2f}) scale({escala:.4f})">{MARCA}</g>
</svg>'''


def escribir(carpeta, nombre, svg, lado):
    carpeta.mkdir(parents=True, exist_ok=True)
    destino = carpeta / nombre
    cairosvg.svg2png(
        bytestring=svg.encode("utf-8"),
        write_to=str(destino),
        output_width=lado,
        output_height=lado,
    )
    print(f"  {destino.relative_to(RAIZ)}  ({lado}x{lado})")


print("Generando iconos de Kalibra")

# === Android: fuentes para @capacitor/assets ================================

# Icono adaptativo. Android lo recorta con formas que dependen del lanzador.
# De un lienzo de 108dp solo los 72dp centrales estan garantizados. La marca
# ocupa 620px de 1024 para quedar comoda dentro de esa zona segura (682px).
escribir(ASSETS, "icon-foreground.png", svg_marca(1024, ancho_marca=620), 1024)
escribir(
    ASSETS,
    "icon-background.png",
    svg_marca(1024, ancho_marca=0.01, fondo=FONDO),
    1024,
)

# Icono plano, para Android anteriores a 8.0 y la ficha de Play Store. Sin
# recorte, la marca puede ocupar mas: 700 de 1024.
escribir(ASSETS, "icon.png", svg_marca(1024, ancho_marca=700, fondo=FONDO), 1024)

# Splash. Lienzo muy grande porque se recorta al centro en cualquier
# proporcion de pantalla. La marca va chica: es una pantalla de arranque.
for nombre in ("splash.png", "splash-dark.png"):
    escribir(ASSETS, nombre, svg_marca(2732, ancho_marca=820, fondo=FONDO), 2732)

with open(ASSETS / "logo.svg", "w", encoding="utf-8") as f:
    f.write(svg_marca(512, ancho_marca=350, fondo=FONDO, radio=96))
print("  assets/logo.svg")

# === Web y PWA ==============================================================

# Favicon de la pestana del navegador.
escribir(
    PUBLIC,
    "favicon.png",
    svg_marca(512, ancho_marca=350, fondo=FONDO, radio=96),
    512,
)

# Iconos de la PWA, proposito "any". Fondo cuadrado y sin redondear: el
# sistema operativo aplica su propia forma al instalar, y un redondeo propio
# quedaria con esquinas transparentes recortadas dentro del del sistema.
escribir(PUBLIC, "pwa-192.png", svg_marca(192, ancho_marca=130, fondo=FONDO), 192)
escribir(PUBLIC, "pwa-512.png", svg_marca(512, ancho_marca=350, fondo=FONDO), 512)

# Icono "maskable". Android lo recorta en circulo, gota o cuadrado segun el
# fabricante, y solo garantiza visible el circulo central del 80%. La marca
# va mas chica que en el icono "any" para no perder los extremos del brazo.
escribir(
    PUBLIC,
    "pwa-maskable-512.png",
    svg_marca(512, ancho_marca=290, fondo=FONDO),
    512,
)

# iOS ignora el manifiesto para el icono de inicio y usa este. Tambien lo
# redondea por su cuenta.
escribir(
    PUBLIC,
    "apple-touch-icon.png",
    svg_marca(180, ancho_marca=122, fondo=FONDO),
    180,
)

print("Listo.")
