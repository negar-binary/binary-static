const Table            = require('../../../../../common_functions/attach_dom/table');
const localize         = require('../../../../../base/localize').localize;
const Client           = require('../../../../../base/client');
const elementInnerHtml = require('../../../../../common_functions/common_functions').elementInnerHtml;
const formatMoney      = require('../../../../../common_functions/currency').formatMoney;

const LimitsUI = (() => {
    let client_limits = '';

    const appendRowTable = (name, turnover_limit, padding, font_weight) => {
        client_limits.append($('<tr/>', { class: 'flex-tr' })
            .append($('<td/>', { class: 'flex-tr-child', style: `padding-left: ${padding}; font-weight: ${font_weight};`, text: localize(name) }))
            .append($('<td/>', { html: turnover_limit })));
    };

    const fillLimitsTable = (limits) => {
        const currency = Client.get('currency');

        if (currency) {
            $('.limit').append(` (${currency})`);
        }

        const open_position   = document.getElementById('open-positions');
        const account_balance = document.getElementById('account-balance');
        const payout          = document.getElementById('payout');
        const payout_per      = document.getElementById('payout-per-symbol-and-contract-type');

        elementInnerHtml(open_position, limits.open_positions);
        elementInnerHtml(account_balance, formatMoney(currency, limits.account_balance, 1));
        elementInnerHtml(payout, formatMoney(currency, limits.payout, 1));
        elementInnerHtml(payout_per, formatMoney(currency, limits.payout_per_symbol_and_contract_type, 1));

        const market_specific = limits.market_specific;
        client_limits = $('#client-limits');
        Object.keys(market_specific).forEach((key) => {
            const object = market_specific[key];
            if (object.length && object.length > 0) {
                appendRowTable(localize(key.charAt(0).toUpperCase() + key.slice(1)), '', 'auto', 'bold');
                Object.keys(object).forEach((c) => {
                    if (Client.get('residence') !== 'jp' || /Major Pairs/.test(object[c].name)) {
                        appendRowTable(object[c].name, object[c].turnover_limit !== 'null' ? formatMoney(currency, object[c].turnover_limit, 1) : 0, '25px', 'normal');
                    }
                });
            } else {
                appendRowTable(object.name, object.turnover_limit !== 'null' ? formatMoney(currency, object.turnover_limit, 1) : 0, 'auto', 'bold');
            }
        });
        const login_id =  Client.get('loginid');
        if (login_id) {
            $('#trading-limits').prepend(`${login_id} - `);
            $('#withdrawal-title').prepend(`${login_id} - `);
        }
        $('#withdrawal-limits, #limits-title').setVisibility(1);
    };

    const clearTableContent = () =>  {
        Table.clearTableBody('client-limits');
    };

    return {
        clearTableContent,
        fillLimitsTable,
    };
})();

module.exports = LimitsUI;
