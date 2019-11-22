export function getDealLink(co_id, deal_id, instant_id) {
    switch (co_id) {
        case "cpn":
            return "http://www.coupang.com/deal.pang?coupang=" + deal_id;
        case "cpn2":
            if (instant_id == 3) // TODO: origin source use instant
                return "http://www.coupang.com/?act=dispCoupangTimeDetail&src=" + deal_id;
            else
                return "http://www.coupang.com/deal.pang?coupang=" + deal_id;
        case "wmp":
            return "http://www.wemakeprice.com/deal/adeal/" + deal_id;
        case "grp":
            return "http://www.groupon.kr/app/Product/pview/" + deal_id;
        case "grpn":
            return "http://www.groupon.kr/app/Now/detail/" + instant_id;
        case "tmn":
            return "http://www.ticketmonster.co.kr/deal/?p_no=" + deal_id;
        case "tmnw":
            return "http://www.ticketmonster.co.kr/now/?m=review&promotion={$deal_id}&puff={$instant_id}";
        case "cj":
            return "http://www.cjmall.com/prd/detail_cate.jsp?chn_cd=30001016&prntctg_id=000001&ctg_id=000086&item_cd=" + deal_id;
    }
    return "#";
}