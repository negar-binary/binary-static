pjax_config_page("limitws", function(){
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);

                    if (response) {
                        var type = response.msg_type;
                        if (type === 'get_limits'){
                            LimitsWS.limitsHandler(response);
                        } else if (type === 'get_account_status') {
                            LimitsWS.authHandler(response);
                        }
                    }
                }
            });
            Content.populate();
            LimitsWS.init();
        },
        onUnload: function(){
            LimitsWS.clean();
        }
    };
});
