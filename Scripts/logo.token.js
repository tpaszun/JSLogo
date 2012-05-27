var Token = (function(){
    var public = {};

    public.T_IDENTIFIER  = 0;
    public.T_NUMBER         = 1;
    public.T_WORD           = 2;
    public.T_THING          = 3;
    public.T_OPEN_LIST      = 4;
    public.T_CLOSE_LIST     = 5;
    public.T_OPEN_PAREN     = 6;
    public.T_CLOSE_PAREN    = 7;

    public.Create = function(type, value) {
        return {
            type: type,
            value: value
        };
    }

    return public;
})();