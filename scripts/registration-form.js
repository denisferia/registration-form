const FORMVALIDATION = {
    $form : ".registration-form form.main",
    errorClass : 'error',
    regexp : {
        text : /[(a-z)]{2,}/gi,
        email : /^\w+\.|\-|\w+\w+[@]\w+(\-{1}|\w)\w+[.]\w{2,3}/,
        areaCode : /^\d{2,3}$/,
        phone : /^\d{8}$/
    },
    confirmationInputTypes : ["email", "password"],
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

        //self.$form.submit(self._validateFields());
    },

    _validateFields : function () {
        var self = this;

        self.$form.find("input").each(function(i){
            let inputType = this.type,
                inputValue = this.value,
                container = $(this.closest("div")),
                numberCount = 0,
                letterCount = 0;

            switch (inputType) {
                case "text":
                    if (self.regexp.text.test(inputValue) || !inputValue){

                        container.toggleClass(self.errorClass);
                    } else {
                        container.removeClass(self.errorClass);
                    }
                    break;
                case "email":

                    if (self.regexp.email.test(inputValue) || !inputValue){
                        container.addClass(self.errorClass);
                    } else {
                        container.removeClass(self.errorClass);
                    }
                    break;
                case "tel":
                    if (inputValue) {
                        if ($(this).hasClass("tel-area-code") && self.regexp.areaCode.test(inputValue)) {
                            $(this).toggleClass(self.errorClass);

                        } else if (self.regexp.phone.test(inputValue)) {

                            $(this).toggleClass(self.errorClass);
                        }
                    } else {
                        $(this).toggleClass(self.errorClass);
                    }
                    break;
                case "password":

                    if (inputValue){
                        [...inputValue].forEach(char => {
                            if (/\d/.test(char)){
                                numberCount++;
                                numberCount === self.passwordRequirements.numberCount ? self.passwordVerifier.$numbers.addClass(self.passwordVerifier.verified) : self.passwordVerifier.$numbers.addClass(self.passwordVerifier.notVerified);
                            } else if(/[a-z]/i.test(char)){
                                letterCount++;
                                letterCount === self.passwordRequirements.letterCount ? self.passwordVerifier.$letters.addClass(self.passwordVerifier.verified): self.passwordVerifier.$letters.addClass(self.passwordVerifier.notVerified);
                            }
                        });
                    } else {
                        self.passwordVerifier.$letters.addClass(self.passwordVerifier.notVerified);
                        self.passwordVerifier.$numbers.addClass(self.passwordVerifier.notVerified);
                    }
                break;
            }

            for(i = 0; i < self.confirmationInputTypes.length; i++){
                if (inputType === self.confirmationInputTypes[i] && $(this).hasClass("confirmation") ){
                    if (!inputValue){
                        container.addClass(self.errorClass);
                    } else if (){
                        
                    }
                }
            }
        });
    }
};

$(function () {
    FORMVALIDATION.init();
});