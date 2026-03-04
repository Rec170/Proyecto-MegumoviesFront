// API helper
const API_BASE = (window.API_BASE || "").replace(/\/+$/, "");
const apiUrl = (path) => API_BASE ? `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}` : path;

const btnPagar = document.getElementById("btnPagar");

// Protect internal pages
const page = (window.location.pathname.split("/").pop() || "").toLowerCase();
const publicPages = ["index.html", "registro.html", ""];
if (!publicPages.includes(page)) {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "index.html";
}


if (btnPagar) {
    btnPagar.addEventListener("click", simularPago);
}

function simularPago() {

    const numero = document.getElementById("numero").value.trim();
    const titular = document.getElementById("titular").value.trim();
    const fecha = document.getElementById("fecha").value;
    const cvv = document.getElementById("cvv").value.trim();
    const resultado = document.getElementById("resultado");

    if (numero.length !== 16 || isNaN(numero)) {
        resultado.textContent = "El número de tarjeta no es válido.";
        resultado.style.color = "red";
        return;
    }

    if (titular.length < 3) {
        resultado.textContent = "El nombre del titular es demasiado corto.";
        resultado.style.color = "red";
        return;
    }

    if (!fecha) {
        resultado.textContent = "Debes seleccionar una fecha de expiración.";
        resultado.style.color = "red";
        return;
    }

    if (cvv.length !== 3 || isNaN(cvv)) {
        resultado.textContent = "El CVV debe tener 3 dígitos.";
        resultado.style.color = "red";
        return;
    }

    resultado.textContent = "Pago procesado con éxito";
    resultado.style.color = "green";

    setTimeout(() => {
        window.location.href = "paginaprincipal.html";
    }, 1500);
}
//Clases
class capitulo {
    constructor(titulo,descripcion,miniatura){
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.miniatura = miniatura;      
    }
}
class contenido {
    constructor(titulo, descripcion, miniatura) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.duracion = 0;
        this.miniatura = miniatura;
        this.capitulos = [];
    }
    calcularDuracion() {
        let duracionTemp = 0;
        this.capitulos.forEach(c => {
            duracionTemp += Number(c.duracion);
        });
        this.duracion = duracionTemp;
    }
    agregarCapitulo(titulo, descripcion, duracion, miniatura = "") {
        const nuevoCapitulo = new capitulo(titulo,descripcion,duracion,miniatura);
        this.capitulos.push(nuevoCapitulo);
        this.calcularDuracion();
    }
}
class gestorDeContenido {
    constructor(){
        this.contenidos = [];
    }
    agregarContenido(titulo,descripcion,miniatura){
        const content = new contenido(titulo,descripcion,miniatura);
        this.contenidos.push(content);
    }
}

// para registrarse (API)
const registroForm = document.getElementById("registroForm");

if (registroForm) {
    registroForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.querySelector(".correo").value.trim();
        const name = document.querySelector(".username").value.trim();
        const password = document.querySelector(".password").value;

        try {
            const res = await fetch(apiUrl(`/auth/register`), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name, password })
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                alert(data.error || "No se pudo registrar");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("usuarioActivo", data.user?.name || name);
            localStorage.setItem("userId", data.user?.id || "");

            alert("Usuario creado correctamente");
            window.location.href = "pagos.html";
        } catch (err) {
            console.error(err);
            alert("Error de conexión con el servidor");
        }
    });
}

// iniciar sesion (API)
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.querySelector(".correo").value.trim();
        const password = document.querySelector(".password").value;

        try {
            const res = await fetch(apiUrl(`/auth/login`), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                alert(data.error || "Correo o contraseña incorrectos");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("usuarioActivo", data.user?.name || email);
            localStorage.setItem("userId", data.user?.id || "");

            alert("Inicio de sesión correcto");
            window.location.href = "paginaprincipal.html";
        } catch (err) {
            console.error(err);
            alert("Error de conexión con el servidor");
        }
    });
}

//pa cerrar la sesion
const logoutBtn = document.querySelector(".logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        // Borra la sesión activa
        localStorage.removeItem("usuarioActivo");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        // Redirige al login
        window.location.href = "index.html";
    });
}


function myFunction() {
    window.location.href = "metodospagos.html";
}


  
//Funciones de overlay
function mostrarDetalle(index){
    const contenido = gestor.contenidos[index];

overlay.innerHTML = `
    <div class="detalle-contenido">
        <button class="cerrar">X</button>
        <img src="${contenido.miniatura}" class="dettalle-img">
        <h1>${contenido.titulo}</h1>
        <p>${contenido.descripcion}</p>

        <h3>Capítulos</h3>
        <ul>
        ${
            contenido.capitulos.length
            ? contenido.capitulos.map(c => 
                `<li>${c.titulo} - ${c.duracion} min</li>`
              ).join('')
            : '<li>No Chapters</li>'
        }
        </ul>
    </div>
`;
    overlay.classList.add("activo");
    document.body.style.overflow = "hidden";

    overlay.querySelector(".cerrar").onclick = cerrarDetalle;
}
function cerrarDetalle(){
    overlay.classList.remove("activo");
    document.body.style.overflow = "";
}


// ===============================
// Página actual / referencias comunes
// ===============================
const overlay = document.getElementById("detalle-overlay");

// contenedores (según la página)
const contenedorCatalogo = document.getElementById("contenedor-catalogo");
const contenedorFavoritos = document.getElementById("contenedor-favoritos");

// buscador (si existe en la página)
const inputBuscador = document.getElementById("buscador");
const btnBuscar = document.getElementById("btn-buscar");

// ===============================
// Catálogo (Películas) - datos locales con descripciones
// ===============================
const gestor = new gestorDeContenido();

// Descripciones cortas para que se vean bien en el detalle
const DESCRIPCIONES = {
  "ej1": "Un hacker descubre que la realidad es una simulación y se une a una rebelión contra las máquinas.",
  "ej2": "Un thriller oscuro lleno de giros, secretos y decisiones que lo cambian todo.",
  "ej3": "Acción intensa con un héroe improbable enfrentando un reto imposible.",
  "ej4": "Fantasía y épica: un héroe debe salvar su mundo antes de que sea demasiado tarde.",
  "ej5": "Un joven con poderes inesperados debe elegir entre la vida normal y la responsabilidad.",
  "ej6": "Misterio y tensión: nada es lo que parece, y cada pista abre más preguntas.",
  "ej7": "Aventura familiar con humor y corazón, perfecta para ver en maratón.",
  "ej8": "Drama con toques de comedia: amistades, caos y segundas oportunidades.",
  "ej9": "Terror clásico con atmósfera pesada y sustos bien puestos.",
  "ej10": "Kaijus y mechas: batallas gigantes para salvar a la humanidad.",
  "ej11": "Historia emotiva sobre crecer, perder y volver a intentarlo.",
  "ej12": "Acción y conspiración: un secreto enterrado sale a la luz.",
  "ej13": "Superhéroes, tecnología y ego: el precio de ser el más brillante.",
  "ej14": "Una aventura rápida con persecuciones, humor y un final sorpresa.",
  "ej15": "Un ogro, un burro y un viaje que termina cambiando todo su destino."
};

// Posters locales (ya existentes en assets)
gestor.agregarContenido("ej1", DESCRIPCIONES["ej1"], "./assets/img/poster-matrix.jpg");
gestor.agregarContenido("ej2", DESCRIPCIONES["ej2"], "./assets/img/tumblr_inline_nsx1hym5881t35chj_1280.jpg");
gestor.agregarContenido("ej3", DESCRIPCIONES["ej3"], "./assets/img/81az0oR6izL._AC_UF894,1000_QL80_.jpg");
gestor.agregarContenido("ej4", DESCRIPCIONES["ej4"], "./assets/img/primer-poster-de-la-pelicula-de-marvel-thor-el-mundo-oscuro-original.jpg");
gestor.agregarContenido("ej5", DESCRIPCIONES["ej5"], "./assets/img/the-amazing-spider-man-2012-movie-posters-v0-t70eiq3n4a691.webp");
gestor.agregarContenido("ej6", DESCRIPCIONES["ej6"], "./assets/img/images (1).jpg");
gestor.agregarContenido("ej7", DESCRIPCIONES["ej7"], "./assets/img/famous-memes-as-posters-for-disney-pixar-movies-v0-ip2hni6h3lhc1.jpg");
gestor.agregarContenido("ej8", DESCRIPCIONES["ej8"], "./assets/img/movie-covers-v0-vgewq8iul2de1.webp");
gestor.agregarContenido("ej9", DESCRIPCIONES["ej9"], "./assets/img/Portada_CINE-DE-TERROR-NIÑOS_JPG-scaled.jpg");
gestor.agregarContenido("ej10", DESCRIPCIONES["ej10"], "./assets/img/pacific_64v9.jpg");
gestor.agregarContenido("ej11", DESCRIPCIONES["ej11"], "./assets/img/unnamed.webp");
gestor.agregarContenido("ej12", DESCRIPCIONES["ej12"], "./assets/img/44a007cc9480c7e3c02f8b2b4c4978e3.jpg");
gestor.agregarContenido("ej13", DESCRIPCIONES["ej13"], "./assets/img/P_Iron_Man_2_5.webp");
gestor.agregarContenido("ej14", DESCRIPCIONES["ej14"], "./assets/img/images.jpg");
gestor.agregarContenido("ej15", DESCRIPCIONES["ej15"], "./assets/img/P_shrek_13.jpg");

// ===============================
// Favoritos (localStorage)
// ===============================
const usuarioActual = localStorage.getItem("usuarioActivo") || "invitado";
const keyFavoritos = `favoritos_${usuarioActual}`;

function getPoster(item) {
  // películas usan miniatura; series viejas usan img
  if (item.miniatura) return item.miniatura;
  if (item.img) return `./assets/img/${item.img}`;
  if (item.imagen) return item.imagen;
  if (item.posterUrl) return item.posterUrl;
  return "";
}

function normalizarFavorito(item) {
  // asegura formato común
  return {
    titulo: item.titulo || "",
    descripcion: item.descripcion || "",
    miniatura: item.miniatura || (item.img ? `./assets/img/${item.img}` : ""),
    tipo: item.tipo || (item.img ? "serie" : "pelicula")
  };
}

function leerFavoritos() {
  try {
    const raw = JSON.parse(localStorage.getItem(keyFavoritos)) || [];
    return raw.map(normalizarFavorito).filter(x => x.titulo);
  } catch {
    return [];
  }
}

function guardarFavoritos(lista) {
  localStorage.setItem(keyFavoritos, JSON.stringify(lista));
}

function toggleFavorito(item) {
  const fav = normalizarFavorito(item);
  let favoritos = leerFavoritos();
  const idx = favoritos.findIndex(f => f.titulo === fav.titulo);
  if (idx === -1) favoritos.push(fav);
  else favoritos.splice(idx, 1);
  guardarFavoritos(favoritos);

  // si estamos en la página de favoritos, refresca
  if (contenedorFavoritos) renderFavoritos();
}

function esFavorito(titulo) {
  const favoritos = leerFavoritos();
  return favoritos.some(f => f.titulo === titulo);
}

// ===============================
// Render de catálogo (paginaprincipal)
// ===============================
function renderCatalogo(lista) {
  if (!contenedorCatalogo) return;
  contenedorCatalogo.innerHTML = "";

  lista.forEach((elemento, index) => {
    const contenedorTarjeta = document.createElement("div");
    contenedorTarjeta.classList.add("card-container");

    const img = document.createElement("img");
    img.className = "card";
    img.src = getPoster(elemento);
    img.alt = elemento.titulo;

    img.addEventListener("click", () => {
      mostrarDetalle(index);
    });

    const iconoFav = document.createElement("span");
    iconoFav.innerHTML = "❤";
    iconoFav.classList.add("btn-favorito");
    if (esFavorito(elemento.titulo)) iconoFav.classList.add("active");

    iconoFav.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorito(elemento);
      iconoFav.classList.toggle("active");
    });

    contenedorTarjeta.appendChild(img);
    contenedorTarjeta.appendChild(iconoFav);
    contenedorCatalogo.appendChild(contenedorTarjeta);
  });
}

function filtrarCatalogo() {
  if (!contenedorCatalogo || !inputBuscador) return;
  const texto = (inputBuscador.value || "").toLowerCase();
  const filtrados = gestor.contenidos.filter(p =>
    (p.titulo || "").toLowerCase().includes(texto)
  );
  renderCatalogo(filtrados);
}

// inicializa catálogo solo en páginas que lo tengan
if (contenedorCatalogo) {
  renderCatalogo(gestor.contenidos);

  if (inputBuscador) inputBuscador.addEventListener("input", filtrarCatalogo);
  if (btnBuscar) btnBuscar.addEventListener("click", filtrarCatalogo);
}

// ===============================
// Render de favoritos (favoritos.html)
// ===============================
function renderFavoritos() {
  if (!contenedorFavoritos) return;

  const favoritos = leerFavoritos();
  contenedorFavoritos.innerHTML = "";

  if (!favoritos.length) {
    const p = document.createElement("p");
    p.textContent = "Aún no tienes favoritos. Agrega algunos desde Películas o Series ❤️";
    contenedorFavoritos.appendChild(p);
    return;
  }

  favoritos.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card-container");

    const img = document.createElement("img");
    img.className = "card";
    img.src = getPoster(item);
    img.alt = item.titulo;

    // opcional: clic abre detalle "simple" si hay descripción
    img.addEventListener("click", () => {
      if (!overlay) return;
      overlay.innerHTML = `
        <div class="detalle">
          <button class="cerrar">✕</button>
          <h2>${item.titulo}</h2>
          ${item.descripcion ? `<p>${item.descripcion}</p>` : ""}
        </div>
      `;
      overlay.classList.add("activo");
      document.body.style.overflow = "hidden";
      overlay.querySelector(".cerrar").onclick = cerrarDetalle;
    });

    const iconoFav = document.createElement("span");
    iconoFav.innerHTML = "❤";
    iconoFav.classList.add("btn-favorito", "active");

    iconoFav.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorito(item);
    });

    card.appendChild(img);
    card.appendChild(iconoFav);
    contenedorFavoritos.appendChild(card);
  });
}

if (contenedorFavoritos) {
  renderFavoritos();
}