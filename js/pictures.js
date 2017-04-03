'use strict'

function generate() {
    var photoInfo = [];
    for (var i=0; i<25; i++) {
        var comments = ['Всё отлично!', 
        'В целом всё неплохо. Но не всё.', 
        'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце-концов это просто непрофессионально.', 
        'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
        'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
        'Лица у людей на фотке перекошены, как-будто их избивают. Как можно было поймать такой неудачный момент?!'];
        var pic = {
            url: 'photos/' + (i + 1) + '.jpg', 
            likes: Math.floor(Math.random() * (200-15) + 15), 
            comments: [ comments[Math.floor(Math.random() * comments.length)] ]
        }
        photoInfo.push(pic)
    }
    return(photoInfo);
} 

var pics = generate();

function creatingDOMElement(pic) {
    var template = document.querySelector('#picture-template');
    
    var image = template.content.querySelector('img');
    image.setAttribute('src', pic.url);

    var like = template.content.querySelector('.picture-likes');
    like.textContent = pic.likes

    var comment = template.content.querySelector('.picture-comments');
    comment.textContent = pic.comments;

    var clone = document.importNode(template.content, true);
    document.querySelector('.pictures').appendChild(clone);    
}

for(var i = 0; i < 25; i++) {
    creatingDOMElement(pics[i])  
}
    
function fillUploadOverlay (pic) {
    var uploadOverlay = document.querySelector('.upload-overlay');
    uploadOverlay.className += ' invisible';

    var galleryOverlay = document.querySelector('.gallery-overlay');
    galleryOverlay.classList.remove('invisible');

    var image = galleryOverlay.querySelector('.gallery-overlay-image');
    image.setAttribute('src', pic.url);

    var like = galleryOverlay.querySelector('.likes-count');
    like.textContent = pic.likes;

    var comment = galleryOverlay.querySelector('.comments-count');
    comment.textContent = pic.comments.length;
}

fillUploadOverlay(pics[0]);