// Función para el menú de hamburguesa
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

// --- CONFIGURACIÓN DE TRADUCCIONES (i18next) ---

// Función principal para inicializar la traducción
async function inicializarTraductor() {
    // Referencia a la biblioteca i18next (cargada desde el CDN en index.html)
    const i18next = window.i18next;

    // Función para cargar los archivos de traducción (JSON)
    async function cargarTraduccion(idioma) {
        const response = await fetch(`./assets/locales/${idioma}/translation.json`);
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo de traducción para "${idioma}"`);
        }
        return response.json();
    }

    // Carga las traducciones en paralelo para mejorar el rendimiento
    const [traduccionES, traduccionEN] = await Promise.all([
        cargarTraduccion('es'),
        cargarTraduccion('en')
    ]);

    // Inicializa i18next con las traducciones cargadas
    await i18next.init({
        lng: 'es', // Idioma por defecto
        debug: false, // Cambiar a true para ver mensajes de depuración en la consola
        resources: {
            es: {
                translation: traduccionES,
            },
            en: {
                translation: traduccionEN,
            },
        },
    });

    // Función para actualizar el contenido de la web con el idioma seleccionado
    function actualizarContenido() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.innerHTML = i18next.t(key);
        });
    }

    // Función para gestionar el cambio de idioma
    function cambiarIdioma(evento) {
        evento.preventDefault(); // Previene que el enlace recargue la página
        const idiomaSeleccionado = evento.target.getAttribute('data-lang');
        
        i18next.changeLanguage(idiomaSeleccionado).then(() => {
            actualizarContenido();
            // Opcional: añade una clase al botón activo
            document.querySelectorAll('.language-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-lang') === idiomaSeleccionado);
            });
        });
    }

    // Asigna el evento de clic a todos los botones de idioma
    document.querySelectorAll('.language-btn').forEach(button => {
        button.addEventListener('click', cambiarIdioma);
    });

    // Llama a la función por primera vez para traducir la página al cargar
    actualizarContenido();
    // Opcional: marca el botón del idioma por defecto como activo
    document.querySelector('.language-btn[data-lang="es"]').classList.add('active');
}

// Llama a la función principal cuando el contenido del DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', inicializarTraductor);