# Reglas de R8 para Kalibra.
#
# R8 elimina todo el codigo que no ve referenciado. El problema es que
# Capacitor instancia sus plugins por REFLEXION, a partir de anotaciones y
# del nombre de la clase, no con una llamada directa que R8 pueda rastrear.
# Sin estas reglas, R8 considera huerfanas esas clases y las borra, y la app
# falla al arrancar UNICAMENTE en el build de release, que es el tipo de
# error mas caro de encontrar.

# --- Capacitor: el puente y sus plugins -------------------------------------
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keep class * extends com.getcapacitor.Plugin { *; }

# Los metodos anotados con @PluginMethod se invocan desde JavaScript por
# nombre: si R8 los renombra, el puente deja de encontrarlos.
-keepclassmembers class * {
    @com.getcapacitor.PluginMethod public <methods>;
}

# Puentes JavaScript hacia Java, por la misma razon.
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# --- Cordova, que Capacitor arrastra para compatibilidad --------------------
-keep class org.apache.cordova.** { *; }

# --- Informes de errores ----------------------------------------------------
# Conserva numeros de linea en los stack traces. Sin esto, un error en
# produccion llega como una lista de metodos sin nombre ni ubicacion y es
# practicamente imposible de diagnosticar. El nombre del archivo original si
# se oculta, que es lo que aporta la ofuscacion.
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Las anotaciones hacen falta para que las reglas de arriba puedan aplicarse.
-keepattributes *Annotation*, Signature, InnerClasses, EnclosingMethod

# --- Silenciar avisos de clases opcionales ----------------------------------
# Dependencias que declaran referencias a bibliotecas que la app no incluye.
# Son opcionales y no se usan: el aviso es ruido.
-dontwarn org.chromium.**
-dontwarn javax.annotation.**
