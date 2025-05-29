// class DropHeader {

// }

// class DropDown extends HTMLElement {
//   #shadowRoot;

//   constructor() {
//       super();

//       this.#shadowRoot = this.attachShadow({ mode: 'open' });
//       this.#shadowRoot.innerHTML = `
//           <style>
//               ${this.style}
//           </style>

//           <div class="slider mt-3" data-slide="4">
//           <div class="slidetitle">
//             <div class="d-flex align-items-center">
//               <i class='bx bx-menu' style="font-size: 1.5em; color: lightgreen;"></i>
//               <p> Модули</p>
//             </div>
//             <i class='slideicon bx bx-chevron-down'></i>            
//           </div>
//         </div>
//         <div class="content" data-slide="4">
//           <div class="d-flex align-items-end p-3 pt-0" style="flex-wrap:wrap-reverse; width: auto;">
//               <button class="module default-btn m-2 active" data-module="highest">Топ товаров</button>
//               <button class="module default-btn m-2" data-module="lastbuys">Последние покупки</button>
//             </div>
//             <div class="module-edit p-3 mb-4" style="text-align: left;"> </div>
//             <button class="save-module default-btn mb-3 w-100" data-module="">Сохранить</button>
//           </div>  
//         </div>
//       `;
//   }

//   connectedCallback() {
//     $(document).on("click", "drop-down", function (e) {
//         e.preventDefault();
//     });
//   }

//   get style() {
//     return `
//     .slider {
//       background-color: #42426e;
//       padding: 10px 23px;
//       width: 100%;
//       margin: 0 auto;
//       border-top-left-radius: 20px;
//       border-top-right-radius: 20px;
//       border-bottom-right-radius: 20px;
//       border-bottom-left-radius: 20px;
//       color: #ffffff;
//       -webkit-transition: height 1s, background-color 0.5s, border-top-left-radius 0.1s, border-top-right-radius 0.1s, border-bottom-right-radius 0.1s, border-bottom-left-radius 0.1s;
//       transition: height 1s, background-color 0.5s, border-top-left-radius 0.1s, border-top-right-radius 0.1s, border-bottom-right-radius 0.1s, border-bottom-left-radius 0.1s;
//       cursor: pointer;
//     }
//     .slider .slidetitle {
//       display: -webkit-box;
//       display: -ms-flexbox;
//       display: flex;
//       -webkit-box-pack: justify;
//           -ms-flex-pack: justify;
//               justify-content: space-between;
//       -webkit-box-align: center;
//           -ms-flex-align: center;
//               align-items: center;
//       font-size: 1.5em;
//     }
//     .slider .slidetitle p {
//       margin-top: 15px;
//     }
//     .slider .slideicon {
//       font-size: 3em;
//       color: #ffffff;
//       -webkit-transition: all 0.5s;
//       transition: all 0.5s;
//     }
//     .slider:is(.active) {
//       background-color: #5f5f9a;
//       border-top-left-radius: 20px;
//       border-top-right-radius: 20px;
//       border-bottom-right-radius: 0px;
//       border-bottom-left-radius: 0px;
//     }
//     .slider:is(.active) .slideicon {
//       color: lightgreen;
//       -webkit-transform: rotate(180deg);
//               transform: rotate(180deg);
//     }
    
//     .content {
//       padding: 0 18px;
//       background-color: #5f5f9a;
//       max-height: 0;
//       overflow: hidden;
//       color: white;
//       -webkit-transition: all 0.2s ease-out;
//       transition: all 0.2s ease-out;
//       border-bottom-right-radius: 20px;
//       border-bottom-left-radius: 20px;
//     }
//     .content p {
//       font-size: 1em;
//       line-height: 40px;
//     }
    
//     .titles {
//       background-color: #F86B6B;
//       padding: 20px;
//       color: white;
//     }
//     `;
//   }
// }

// customElements.define('drop-down', DropDown);

