const FORMVALIDATION = {
    $form : ".registration-form form.main",
    errorClass : 'error',
    regexp : {
        text : /[(a-z)|(A-Z)]{2,}/,
        email : /^\w+\.|\-|\w+\w+[@]\w+(\-{1}|\w)\w+[.]\w{2,3}/,
        areaCode : /^\d{2,3}$/,
        phone : /^\d{8}$/
    },
    passwordRequirements : {
        letterCount : 8,
        numberCount : 1
    },
    passwordVerifier : {
        $letters : '#password .verifier .chars',
        $numbers : '#password .verifier .number',
        verified : 'good',
        notVerified : 'bad',
    },
    confirmationClasses : ["confirm-me", "confirmation", "confirmed", "unconfirmed"],
    succesfullContent : "<div><h3>Felicitaciones ya estás registrado</h3><p>¡Avancemos: ahora estás más cerca de tener tu cuenta!</p><button><a>Continuar</a></button></div>",

    init: function () {
        this.$form = $(this.$form);
        this.passwordVerifier.$letters = $(this.$form.find(this.passwordVerifier.$letters));
        this.passwordVerifier.$numbers = $(this.$form.find(this.passwordVerifier.$numbers));
        this.regexp.text = new RegExp(this.regexp.text);
        this.regexp.email = new RegExp(this.regexp.email);
        this.regexp.areaCode = new RegExp(this.regexp.areaCode);
        this.regexp.phone = new RegExp(this.regexp.phone);

        this._bind();
    },

    _bind : function () {
        var self = this;

        self.$form.submit(self._validateFields);
    },

    _validateFields : function (e) {
        e.preventDefault();
        var self = FORMVALIDATION,
            validationCount = 0,
            emailConfirm,
            passConfirm;

        self.$form.find("input").each(function(i){
            let inputType = this.type,
                inputValue = this.value,
                container = $(this.closest("div")),
                numberCount = 0,
                letterCount = 0;

            switch (inputType) {
                case "text":
                    if ( self.regexp.text.test(inputValue) ){
                        container.removeClass(self.errorClass);
                        validationCount++;
                    } else {
                        container.addClass(self.errorClass);
                    }
                    break;
                case "email":

                    if ( $(this).hasClass(self.confirmationClasses[0]) ){
                        if (self.regexp.email.test(inputValue)){
                            container.removeClass(self.errorClass);
                            emailConfirm = inputValue;
                        } else {
                            container.addClass(self.errorClass);
                        }
                    } else if ( $(this).hasClass(self.confirmationClasses[1]) ){
                        if (inputValue === emailConfirm) {
                            container.addClass(self.confirmationClasses[2]).removeClass(self.confirmationClasses[3]);
                            validationCount++;
                        } else {
                            container.addClass(self.confirmationClasses[3])
                        }
                    }
                    break;
                case "tel":
                    if (inputValue) {
                        if ($(this).hasClass("tel-area-code") && self.regexp.areaCode.test(inputValue)) {
                            $(this).removeClass(self.errorClass);
                            validationCount++;
                        } else if (self.regexp.phone.test(inputValue)) {
                            $(this).removeClass(self.errorClass);
                            validationCount++;
                        } else {
                            $(this).addClass(self.errorClass);
                        }
                    } else {
                        $(this).addClass(self.errorClass);
                    }
                    break;
                case "password":
                    if ( $(this).hasClass(self.confirmationClasses[0]) ){
                        if (inputValue){
                            [...inputValue].forEach(char => {
                                if (/\d/.test(char)){
                                    numberCount++;
                                    numberCount === self.passwordRequirements.numberCount ?
                                            self.passwordVerifier.$numbers.removeClass(self.passwordVerifier.notVerified).addClass(self.passwordVerifier.verified) :
                                            self.passwordVerifier.$numbers.removeClass(self.passwordVerifier.verified).addClass(self.passwordVerifier.notVerified);
                                }else {
                                    self.passwordVerifier.$numbers.removeClass(self.passwordVerifier.verified).addClass(self.passwordVerifier.notVerified);
                                }
                                if(/[a-z]/i.test(char)){
                                    letterCount++;
                                    letterCount === self.passwordRequirements.letterCount ?
                                            self.passwordVerifier.$letters.removeClass(self.passwordVerifier.notVerified).addClass(self.passwordVerifier.verified) :
                                            self.passwordVerifier.$letters.removeClass(self.passwordVerifier.verified).addClass(self.passwordVerifier.notVerified);
                                }
                                if (letterCount === self.passwordRequirements.letterCount && numberCount === self.passwordRequirements.numberCount){
                                    passConfirm = inputValue;
                                }
                            });
                        } else {
                            self.passwordVerifier.$letters.removeClass(self.passwordVerifier.verified).addClass(self.passwordVerifier.notVerified);
                            self.passwordVerifier.$numbers.removeClass(self.passwordVerifier.verified).addClass(self.passwordVerifier.notVerified);
                        }
                    } else if ( $(this).hasClass(self.confirmationClasses[1]) ){
                        if (inputValue === passConfirm) {
                            container.addClass(self.confirmationClasses[2]).removeClass(self.confirmationClasses[3]);
                            validationCount++;
                        } else {
                            container.addClass(self.confirmationClasses[3]);
                        }
                    }
                break;
            }
        });

        if (validationCount > 5){
            self.$form.addClass(self.confirmationClasses[2]).empty().append(self.succesfullContent);
            return true;
        }else{
            return false;}


    }
};

$(function () {
    FORMVALIDATION.init();

    $('p.legal a').on('click', function (e) {
        e.preventDefault();
        $('#modal-legales').addClass("show");
    });

    $('#modal-legales .close, #modal-legales .continue').on('click', function(e) {
        e.preventDefault();
        $('#modal-legales').removeClass("show");
    });
});