/*!
 * styles.js
 * CSS do widget, gerado dinamicamente conforme a posição (CFG.position).
 */
import { CFG } from '../config/config.js';

export var WIDGET_CSS = (function () {
  var isRight  = CFG.position.indexOf('right')  > -1;
  var isBottom = CFG.position.indexOf('bottom') > -1;

  return [
    '.ajw-root,.ajw-root *{box-sizing:border-box;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}',

    /* FAB */
    '.ajw-fab{position:fixed;' + (isBottom ? 'bottom:20px' : 'top:20px') + ';' + (isRight ? 'right:20px' : 'left:20px') + ';',
    'width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;',
    'background:#1B5E6E;color:#fff;box-shadow:0 8px 24px rgba(27,94,110,.35);',
    'display:flex;align-items:center;justify-content:center;z-index:2147483646;',
    'transition:transform .2s ease}',
    '.ajw-fab:hover{transform:scale(1.08)}',
    '.ajw-fab:focus-visible{outline:3px solid #7CD0E5;outline-offset:3px}',
    '.ajw-fab svg{width:32px;height:32px}',

    /* Overlay (clique fora fecha; leve, pois o painel é flutuante) */
    '.ajw-overlay{position:fixed;inset:0;background:rgba(0,0,0,.12);z-index:2147483646;',
    'opacity:0;pointer-events:none;transition:opacity .25s ease}',
    '.ajw-overlay.open{opacity:1;pointer-events:auto}',

    /* Painel — janela flutuante compacta (ancorada perto do botão) */
    '.ajw-panel{position:fixed;' + (isBottom ? 'bottom:88px' : 'top:88px') + ';' + (isRight ? 'right:20px' : 'left:20px') + ';',
    'width:300px;max-width:calc(100vw - 40px);max-height:min(70vh,540px);background:#fff;color:#1a2a30;',
    'border-radius:18px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,.24);z-index:2147483647;',
    'transform:translateY(12px) scale(.96);opacity:0;pointer-events:none;',
    'transition:transform .25s cubic-bezier(.2,.8,.2,1),opacity .25s ease;display:flex;flex-direction:column}',
    '.ajw-panel.open{transform:translateY(0) scale(1);opacity:1;pointer-events:auto}',

    /* Cabeçalho */
    '.ajw-header{padding:14px 16px;border-bottom:1px solid #e6eef0;display:flex;align-items:center;justify-content:space-between}',
    '.ajw-title{font-size:16px;font-weight:700;color:#1B5E6E;margin:0;display:flex;gap:8px;align-items:center}',
    '.ajw-close{background:none;border:none;cursor:pointer;padding:6px;color:#1B5E6E;border-radius:8px}',
    '.ajw-close:hover{background:#eef5f7}',
    '.ajw-close:focus-visible{outline:2px solid #1B5E6E;outline-offset:2px}',

    /* Corpo */
    '.ajw-body{padding:12px;overflow-y:auto;flex:1}',

    /* Botões de toggle — CORRIGIDO: espaço entre "solid" e "rgb" */
    '.ajw-item{display:flex;align-items:center;gap:10px;width:100%;padding:9px 12px;margin-bottom:6px;',
    'border:1px solid rgb(66,191,223);background:#fff;border-radius:12px;cursor:pointer;text-align:left;',
    'color:#1a2a30;font-size:13px;font-weight:500;transition:all .15s}',
    '.ajw-item:hover{border-color:#1B5E6E;background:#f3fafc}',
    '.ajw-item:focus-visible{outline:2px solid #1B5E6E;outline-offset:2px}',
    '.ajw-item.active{background:#1B5E6E;color:#fff;border-color:#1B5E6E}',
    '.ajw-item svg{width:20px;height:20px;flex-shrink:0}',

    /* Seção */
    '.ajw-section-title{font-size:11px;font-weight:700;color:#5a7680;text-transform:uppercase;letter-spacing:.08em;margin:10px 6px 6px}',

    /* Row (zoom / tradutor) */
    '.ajw-row{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;',
    'border:1px solid #e6eef0;border-radius:14px;margin-bottom:8px}',
    '.ajw-row label{font-size:14px;font-weight:500}',

    /* Stepper */
    '.ajw-stepper{display:flex;align-items:center;gap:6px}',
    '.ajw-stepper button{width:28px;height:28px;border-radius:50%;border:1px solid #1B5E6E;',
    'background:#fff;color:#1B5E6E;cursor:pointer;font-size:16px;font-weight:700}',
    '.ajw-stepper button:focus-visible{outline:2px solid #1B5E6E;outline-offset:2px}',
    '.ajw-stepper span{min-width:36px;text-align:center;font-weight:600;font-size:13px}',

    /* Select */
    '.ajw-select{width:100%;padding:8px 10px;border-radius:10px;border:1px solid #cbd9dd;background:#fff;font-size:14px}',
    '.ajw-select:focus-visible{outline:2px solid #1B5E6E;outline-offset:2px}',

    /* Rodapé */
    '.ajw-footer{padding:14px;border-top:1px solid #e6eef0}',
    '.ajw-reset{width:100%;padding:12px;border-radius:14px;border:1px solid #1B5E6E;',
    'background:#fff;color:#1B5E6E;cursor:pointer;font-weight:600;font-size:14px}',
    '.ajw-reset:hover{background:#1B5E6E;color:#fff}',
    '.ajw-reset:focus-visible{outline:2px solid #1B5E6E;outline-offset:2px}',
    '.ajw-credit{text-align:center;font-size:11px;color:#7a8e94;margin-top:10px}',

    /* ── Efeitos aplicados no <html> ── */
    'html.ajw-contrast-light{filter:contrast(1.2) brightness(1.1)!important;background:#fff!important}',
    'html.ajw-contrast-dark,html.ajw-contrast-dark body{background:#000!important;color:#fff!important}',
    'html.ajw-contrast-dark a{color:#7CD0E5!important}',
    'html.ajw-contrast-dark img,html.ajw-contrast-dark video{filter:brightness(.85)!important}',
    'html.ajw-grayscale{filter:grayscale(100%)!important}',
    'html.ajw-highlight-links a{background:#FFEB3B!important;color:#000!important;text-decoration:underline!important;padding:0 2px;border-radius:3px}',
    'html.ajw-pause-anim *,html.ajw-pause-anim *::before,html.ajw-pause-anim *::after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}',
    'html.ajw-dyslexia,html.ajw-dyslexia body,html.ajw-dyslexia *{font-family:"OpenDyslexic","Comic Sans MS","Trebuchet MS",sans-serif!important;letter-spacing:.08em!important;word-spacing:.16em!important;line-height:1.7!important}',
    'html.ajw-reading-mode main,html.ajw-reading-mode article,html.ajw-reading-mode body{background:#fdf6e3!important;color:#073642!important}',
    'html.ajw-reading-mode aside:not(.ajw-panel),html.ajw-reading-mode nav:not(.ajw-root nav),html.ajw-reading-mode video,html.ajw-reading-mode iframe{display:none!important}',
    'html.ajw-big-cursor,html.ajw-big-cursor *{cursor:url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="%23000" stroke="%23fff" stroke-width="2" d="M8 4l28 16-13 3 7 14-5 3-7-14-10 8z"/></svg>\') 4 4,auto!important}',

    /* Barra de saída do modo leitura */
    '.ajw-reading-exit{position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:2147483647;',
    'display:none;align-items:center;gap:12px;padding:10px 18px;background:#1B5E6E;color:#fff;border-radius:999px;',
    'box-shadow:0 6px 24px rgba(27,94,110,.45);font-size:14px;font-weight:600;',
    'max-width:calc(100vw - 24px);flex-wrap:wrap;justify-content:center}',
    '.ajw-reading-exit.visible{display:flex}',
    '.ajw-reading-exit-btn{background:#fff;color:#1B5E6E;border:none;padding:7px 16px;border-radius:999px;',
    'cursor:pointer;font-weight:700;font-size:13px;white-space:nowrap}',
    '.ajw-reading-exit-btn:hover{opacity:.92}',
    '.ajw-reading-exit-btn:focus-visible{outline:2px solid #fff;outline-offset:2px}',

    /* Guia de leitura */
    '.ajw-reading-guide{position:fixed;left:0;right:0;height:60px;background:rgba(0,0,0,.55);',
    'pointer-events:none;z-index:2147483645;transition:top .05s linear}',
    '.ajw-reading-guide::before,.ajw-reading-guide::after{content:"";position:absolute;left:0;right:0;',
    'height:9999px;background:rgba(0,0,0,.55);pointer-events:none}',
    '.ajw-reading-guide::before{bottom:100%}',
    '.ajw-reading-guide::after{top:100%}',
    /* Navegação por teclado: destaque de foco e skip-link */
    'html.ajw-keyboard-nav :focus{outline:3px solid #FFB84D;outline-offset:3px}',
    '.ajw-skip-link{position:fixed;left:12px;top:12px;padding:8px 12px;background:#1B5E6E;color:#fff;border-radius:6px;transform:translateY(-140%);transition:transform .15s ease;z-index:2147483650;}',
    '.ajw-skip-link:focus{transform:translateY(0);box-shadow:0 6px 18px rgba(0,0,0,.25)}',
    'html.ajw-keyboard-nav .ajw-skip-link{transform:translateY(0)}',
  ].join('');
}());
