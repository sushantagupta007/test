const swiper = new Swiper(".swiper-container", {
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  observer: true,
  observeParents: true,
  coverflowEffect: {
    rotate: 0,
    stretch: 50,
    depth: 150,
    modifier: 1,
    slideShadows: false,
  },
});

// const loadFinalSwiperCards = () => {
//   const cardImages = JSON.parse(localStorage.getItem("final-card-images"));

//   console.log(cardImages);
//   finalSwiperCards.innerHTML = "";
// for (let i = 0; i < cardImages.length; ++i) {
//   finalSwiperCards.innerHTML += `<div class="swiper-slide" style="transform-style: flat;height: 100%;width: 45%;">
//     <div id=${
//       "swiper-img" + (i + 1).toString()
//     } class="swiper-slide-popup"
//         style="height: 100%;width: 100%; position: relative;background-size:100% 100%; display: flex; justify-content:center; align-items:center; background-size:cover; transform-style: flat;background-image: url(${
//           cardImages[i]
//         });">
//         </div>
//         </div>`;
// }
// };
// <img id=${
//   "watermarkswiper" + (i + 1).toString()
// } style="height: 6%;width: 30%;margin-top: 130%;margin-left: 75%;border: 1px solid transparent;border-radius: 20px;background-color: rgba(0,0,0,0.8);" src="./img/CelebrareLogo.png">
