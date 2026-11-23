/* Tema claro/escuro — um arquivo, vale para o site inteiro.
   Guarda a escolha no navegador e respeita o tema do sistema na primeira visita.
   Coloque <script src="/js/tema.js"></script> no <head>, antes do CSS pintar. */
(function () {
  var CHAVE = 'ric-tema';
  var salvo = null;
  try { salvo = localStorage.getItem(CHAVE); } catch (e) {}
  var sistemaEscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var tema = salvo || (sistemaEscuro ? 'escuro' : 'claro');
  document.documentElement.setAttribute('data-tema', tema);

  window.Tema = {
    atual: function () { return document.documentElement.getAttribute('data-tema'); },
    usar: function (novo) {
      document.documentElement.setAttribute('data-tema', novo);
      try { localStorage.setItem(CHAVE, novo); } catch (e) {}
      document.dispatchEvent(new CustomEvent('tema:mudou', { detail: novo }));
    },
    alternar: function () { this.usar(this.atual() === 'escuro' ? 'claro' : 'escuro'); }
  };
})();
