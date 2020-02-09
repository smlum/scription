// for the modal
document.querySelector('#modal-button').addEventListener('click', function(event) {
    event.preventDefault();
    var modal = document.querySelector('.modal');  // assuming you have only 1
    var html = document.querySelector('html');
    modal.classList.add('is-active');
    html.classList.add('is-clipped');
        
    modal.querySelector('.modal-background').addEventListener('click', function(e) {
        e.preventDefault();
        modal.classList.remove('is-active');
        html.classList.remove('is-clipped');
    });
    });
        
    var acc = document.getElementsByClassName("accordion");
    var accDown = document.getElementsByClassName("accordion-down");
    var i;
    
    for (i = 0; i < accDown.length; i++) {
    accDown[i].addEventListener("click", function() {
        this.parentElement.classList.toggle("active-accordion");
        var panel = this.parentElement.nextElementSibling;
        if (panel.style.display === "block") {
        panel.style.display = "none";
        } else {
        panel.style.display = "block";
        }
    });
    }
