/* Tout le JavaScript ici sera chargé avec chaque page accédée par n’importe quel utilisateur. */

/* =====================================
DECLARATIONS DES FONCTIONS ET PROCEDURES
======================================== */

function showElement(element) {
  element.classList.remove("tabber-noactive");
}

function hideElement(element) {
  element.classList.add("tabber-noactive");
}

function toggleElement(element) {
  element.classList.toggle("tabber-noactive");
}

/* Favicon */
function fixInsecureFavicon() {
  document.querySelector('link[rel="shortcut icon"]').href =
    "https://gf1.geo.gfsrv.net/cdn98/191b803adbf82f4b8febe3a2c38c2c.ico";
}

/* Liste des équipements */
function changeEquipementDisplay(container) {
  var switchButton = container.querySelector(".button");
  var content = container.nextElementSibling;

  switchButton.addEventListener("click", function () {
    switchButton.classList.toggle("tabber-active");
    toggleElement(content);
  });
}

/* Enlève l'animation de chargement et affiche le contenu de la page lorsque c'est nécessaire */
function removeLoadingAnimation() {
  var loadingAnimation = document.getElementById("loading-animation");
  var showAfterLoading = document.getElementById("show-after-loading");

  if (loadingAnimation) {
    hideElement(loadingAnimation);
  }

  if (showAfterLoading) {
    showElement(showAfterLoading);
  }
}

/* BOUTON RETOUR VERS LE HAUT */
function addButtonTop() {
  var contentText = document.querySelector("div#mw-content-text");

  if (contentText !== null) {
    var divButtonTop = document.createElement("div");
    divButtonTop.classList.add("top-button");
    contentText.appendChild(divButtonTop);
  }
}

function buttonTop() {
  var balise = document.querySelector("div#mw-page-header-links");
  var topButton = document.querySelector(".top-button");

  if (balise !== null) {
    var options = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };

    var observer = new IntersectionObserver(callback, options);
    observer.observe(balise);

    function callback(entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          topButton.classList.remove("show-button");
        } else {
          topButton.classList.add("show-button");
        }
      });
    }

    topButton.addEventListener("click", function () {
      document.documentElement.scrollTo({
        top: 0,
      });
    });
  }
}

/* Cookies */
function cookies() {
  var req = new XMLHttpRequest();
  req.addEventListener("load", function (ev) {
    if (this.status >= 200 && this.status < 300) {
      var data = JSON.parse(this.responseText);
      if (data.hasOwnProperty("version")) {
        var gdpr = document.createElement("script");
        gdpr.src =
          "https://s3-static.geo.gfsrv.net/cookiebanner/" +
          data.version +
          "/cookie.min.js";
        document.head.appendChild(gdpr);
      }
    }
  });
  req.open("GET", "https://s3-static.geo.gfsrv.net/cookiebanner/version.json");
  req.send();
}

/* =======================================
FONCTION GLOBALE
Exécutée une fois au chargement de la page
========================================== */

(function () {
  fixInsecureFavicon();

  var urlStart = "/index.php?title=MediaWiki:Script/";
  var urlEnd = ".js&action=raw&ctype=text/javascript";
  var loadScripts = document.querySelectorAll("div[data-load-javascript]");

  var equipmentContainer = document.querySelectorAll(
    "div#mw-content-text .list-equip"
  );

  equipmentContainer.forEach(function (container) {
    changeEquipementDisplay(container);
  });

  /* Charge des scripts spécifiques au chargement de certaines pages */
  if (loadScripts.length) {
    var allowedScripts = {
      Tabber: true,
      Skills: true,
      Modal: true,
      Switch: true,
      Loot: true,
      Map: true,
      Filter: true,
      Calculator: true,
      Element: true,
      Pets: true,
      Colorblind: true,
    };
    var scriptsToLoad = [];

    loadScripts.forEach(function (scriptElement) {
      var scriptName = scriptElement.dataset.loadJavascript;

      if (allowedScripts[scriptName]) {
        allowedScripts[scriptName] = false;
        scriptsToLoad.push(scriptName);
      }
    });

    if (scriptsToLoad.length) {
      var firstScriptName = scriptsToLoad[0];

      if (firstScriptName === "Element") {
        scriptsToLoad.shift()
        $.getScript(urlStart + firstScriptName + urlEnd, function () {
          injectCustomElements();
          loadNextScripts();
        });
      } else {
        loadNextScripts();
      }
    }

    function loadNextScripts() {
      scriptsToLoad.forEach(function (scriptName) {
        mw.loader.load(urlStart + scriptName + urlEnd);
      });

      removeLoadingAnimation();
    }
  }

  if (mw.config.get("wgUserName")) {
    mw.loader.load(urlStart + "Redactor" + urlEnd);
  }

  addButtonTop();
  buttonTop();
  cookies();
})();
