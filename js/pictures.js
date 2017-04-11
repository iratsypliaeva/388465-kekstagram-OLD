'use strict';

function generate() {
  var photoInfo = [];
  var comments = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце-концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как-будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  for (var i = 0; i < 25; i++) {
    var pic = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: Math.floor(Math.random() * (200 - 15) + 15),
      comments: [
        comments[Math.floor(Math.random() * comments.length)]
      ]
    };
    photoInfo.push(pic);
  }
  return photoInfo;
}

var pics = generate();

function creatingDOMElement(pic) {
  var template = document.querySelector('#picture-template');

  var image = template.content.querySelector('img');
  image.setAttribute('src', pic.url);

  var like = template.content.querySelector('.picture-likes');
  like.textContent = pic.likes;

  var comment = template.content.querySelector('.picture-comments');
  comment.textContent = pic.comments;

  var clone = document.importNode(template.content, true);
  document.querySelector('.pictures').appendChild(clone);
}

for (var i = 0; i < 25; i++) {
  creatingDOMElement(pics[i]);
}

function fillUploadOverlay(pic) {
  var uploadOverlay = document.querySelector('.upload-overlay');
  uploadOverlay.className += ' invisible';

  var galleryOverlay = document.querySelector('.gallery-overlay');
  // galleryOverlay.classList.remove('invisible');

  var image = galleryOverlay.querySelector('.gallery-overlay-image');
  image.setAttribute('src', pic.url);

  var like = galleryOverlay.querySelector('.likes-count');
  like.textContent = pic.likes;

  var comment = galleryOverlay.querySelector('.comments-count');
  comment.textContent = pic.comments.length;
}

fillUploadOverlay(pics[0]);

/*
*/
var picture = document.querySelector('.picture');
var galleryOverlay = document.querySelector('.gallery-overlay');
var galleryOverlayClose = document.querySelector('.gallery-overlay-close');

/*
Когда галерея открыта, то клавиша ESC должна закрывать галерею
*/
var onEscPress = function (evt) {
  if (evt.keyCode === 27) {
    closePopup();
  }
};

var closePopup = function () {
  galleryOverlay.classList.add('invisible');
  document.removeEventListener('keydown', onEscPress);
};

/*
При нажатии на любой из элементов .picture должен показываться элемент .gallery-overlay с подробным описанием картинки
*/
picture.addEventListener('click', function () {
  openPopup();
});

var openPopup = function () {
  galleryOverlay.classList.remove('invisible');
  document.addEventListener('keydown', onEscPress);
};

/*
При нажатии на элемент .gallery-overlay-close элемент .gallery-overlay должен скрываться
*/
galleryOverlayClose.addEventListener('click', function (evt) {
  closePopup();
  // evt.stopPropagation();
});

/*
Если галерея открыта и фокус находится на крестике, то нажатие клавиши ENTER приводит к закрытию галереи
*/
var onEnterPressed = function (evt) {
  if (evt.keyCode === 13) {
    closePopup();
  }
};

galleryOverlayClose.addEventListener('focus', function (evt) {
  document.addEventListener('keydown', onEnterPressed);
});
galleryOverlayClose.addEventListener('blur', function (evt) {
  document.removeEventListener('keydown', onEnterPressed);
});

/*
Когда миниатюра в фокусе .picture, то галерея с увеличенным изображением должна показываться по нажатию кнопки ENTER
Необходимо не забыть добавить tabindex='0' для картинки, чтобы элемент фокусировался
*/
var ENTER_KEY_CODE = 13;

var isActivationEvent = function (evt) {
  return evt.keyCode === ENTER_KEY_CODE;
};
galleryOverlay.addEventListener('keydown', function (evt) {
  if (isActivationEvent(evt)) {
    openPopup();
  }
});
galleryOverlayClose.addEventListener('keydown', function (evt) {
  if (isActivationEvent(evt)) {
    closePopup();
  }
});

/*
При изменении значения поля загрузки фотографии #upload-file в форме #upload-select-image, показывается форма кадрирования изображения, а форма загрузки скрывается
*/
var uploadSelectImage = document.querySelector('#upload-select-image');
var uploadFile = uploadSelectImage.querySelector('#upload-file');
var uploadOverlay = document.querySelector('.upload-overlay');
var commentsFocused = false;


var openCropForm = function () {
  uploadSelectImage.classList.add('invisible');
  uploadOverlay.classList.remove('invisible');
  document.addEventListener('keydown', onCropFormEsc);
};
uploadFile.addEventListener('change', function (evt) {
  openCropForm();
});

/*
При нажатии на кнопку .upload-form-cancel форма кадрирования закрывается и показывается форма загрузки изображения
*/
var uploadFormCancel = uploadOverlay.querySelector('.upload-form-cancel');

var closeCropForm = function () {
  uploadSelectImage.classList.remove('invisible');
  uploadOverlay.classList.add('invisible');
  document.removeEventListener('keydown', onCropFormEsc);
};

uploadFormCancel.addEventListener('click', function () {
  closeCropForm();
});

/*
Когда форма кадрирования открыта, то клавиша ESC должна скрывать форму
*/
var onCropFormEsc = function (evt) {
  // Если фокус находится на форме ввода комментария, то форма закрываться не должна
  if (commentsFocused) {
    return;
  }

  if (evt.keyCode === 27) {
    closeCropForm();
  }
};

/*
Если фокус находится на форме ввода комментария, то форма закрываться не должна
*/
var uploadFormDescription = document.querySelector('.upload-form-description');
uploadFormDescription.addEventListener('focus', function () {
  commentsFocused = true;
});
uploadFormDescription.addEventListener('blur', function () {
  commentsFocused = false;
});

/*
Если форма открыта и фокус находится на крестике, то нажатие клавиши ENTER приводит к закрытию формы
Если форма открыта и фокус находится на кнопке «Отправить», нажатие на ENTER приводит к закрытию формы

*/
var onFormEnter = function (evt) {
  if (evt.keyCode === 13) {
    closeCropForm();
  }
};

uploadFormCancel.addEventListener('focus', function () {
  document.addEventListener('keydown', onFormEnter);
});
uploadFormCancel.addEventListener('blur', function () {
  document.removeEventListener('keydown', onFormEnter);
});

/* Форма ввода масштаба .upload-resize-controls-value ограничена
Шаг — 25%
Минимальный масштаб — 25%
Маскимальный масштаб — 100%
*/
var buttonDecrement = document.querySelector('.upload-resize-controls-button-dec');
var buttonIncrement = document.querySelector('.upload-resize-controls-button-inc');
var resizeValue = document.querySelector('.upload-resize-controls-value');
var imagePreview = document.querySelector('.filter-image-preview');
var scale = 100;
var fillScale = function() {
    resizeValue.value = scale + '%';
    imagePreview.style.transform = 'scale'+ '(' + scale/100 + ')';
};
fillScale();

buttonDecrement.addEventListener('click', function() {
    if (scale != 25) {
        scale = scale - 25;
        fillScale();
        
    }
});

buttonIncrement.addEventListener('click', function() {
    if (scale != 100) {
        scale = scale + 25;
        fillScale();
    }
});

/*Применение фильтра к изображению

При смене фильтра, выбором одного из значений среди радиокнопок upload-filter, добавить картинке .filter-image-preview CSS-класс, соответствующий фильтру. 
Название CSS класса повторяет название значение выбранного фильтра без префикса upload. 
Например, если выбран фильтр upload-filter-chrome, изображению нужно добавить класс filter-chrome
*/

document.addEventListener('change', function(evt) {
    if (evt.target.name == 'upload-filter') {
        var filter = evt.target.id;
        imagePreview.classList.add(filter.replace('upload-', ''));
    }
});

/*
*/
openPopup();
