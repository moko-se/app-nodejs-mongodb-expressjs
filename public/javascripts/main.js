const makeNavLinksSmooth = () => {
    const navLinks = document.querySelectorAll('.navbar_link');
    for (let n in navLinks){
        if (navLinks.hasOwnProperty(n)) {
            navLinks[n].addEventListener('click', (e) => {
                e.preventDefault();

                document.querySelector(navLinks[n].hash).scrollIntoView({
                    behavior: "smooth"
                })
            });
        }
    }
}
const spyScrolling = () => {
    const sections = document.querySelectorAll('.section_content');

    window.onscroll = () => {
        const scrollPos = document.documentElement.scrollTop || document.body.scrollTop;

        for (let i in sections){
            if (sections.hasOwnProperty(i) && sections[i].offsetTop <= scrollPos) {
                const id = sections[i].id;
                document.querySelector('.active_link').classList.remove('active_link');

                document.querySelector(`a[href*=${id}]`).classList.add('active_link');
            }
        }
    }
}

makeNavLinksSmooth()
spyScrolling()

// Mon espace
const btnEspace = document.querySelector('#btn_mon_espace');
const menuEspace = document.querySelector('#menu_mon_espace');

if (menuEspace) {
    btnEspace.addEventListener('click', () => {
        let active = menuEspace.classList.toggle('active');
    });
}


const currentLocation = location.href;
const menuItem = document.querySelectorAll('a');
const menuLength = menuItem.length;

for (let i=0; i < menuLength; i++){
    if (menuItem[i].href === currentLocation) {
        menuItem[i].className = "active"
    }
}

// ckeditor
const editor = document.querySelector( '#content' );

if (editor){
    ClassicEditor
        .create( editor )
        .catch( error => {
            console.error( error );
        } 
    );
}

//Scrolled
$(document).scroll(function(){
    $('header').toggleClass('scrolled', $(this).scrollTop() > $('header').height())
});

// navbarToggleresponsive
const toggle_btn_add = document.querySelector('.button-toggle');
const toggle_btn_remove = document.querySelector('.button-toggle-hide');
const items_li = document.querySelectorAll('.items_li');
const menushow =  document.querySelector('.navbartoggle');

if (toggle_btn_add || toggle_btn_remove){
    toggle_btn_add.addEventListener('click', show_menu);
    toggle_btn_remove.addEventListener('click', hide_menu);
}

items_li.forEach(item => {
    item.addEventListener('click', hide_menu);
});

function show_menu(e)
{
    e.preventDefault();
    menushow.classList.add('active');

}

function hide_menu(e)
{
    e.preventDefault();
    menushow.classList.remove('active');
}
