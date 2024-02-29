"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badgeType = exports.STANDING_POSITION = void 0;
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["REGISTRAR"] = "REGISTRAR";
    Role["SCANNER"] = "SCANNER";
})(Role || (Role = {}));
exports.default = Role;
var STANDING_POSITION;
(function (STANDING_POSITION) {
    STANDING_POSITION["entry"] = "entry";
    STANDING_POSITION["bag"] = "bag";
    STANDING_POSITION["lunch"] = "lunch";
    STANDING_POSITION["evening_events"] = "evening_events";
    STANDING_POSITION["B2B_cupping_rooms"] = "B2B_cupping_rooms";
    STANDING_POSITION["sustainability_day_meeting"] = "";
    STANDING_POSITION["producers_day"] = "producers_day";
    STANDING_POSITION["workshops"] = "workshops";
    STANDING_POSITION["coffee_Safari"] = "coffee_Safari";
    STANDING_POSITION["members_lounge"] = "members_lounge";
    STANDING_POSITION["meeting_room_entrances"] = "meeting_room_entrances";
})(STANDING_POSITION || (exports.STANDING_POSITION = STANDING_POSITION = {}));
var badgeType;
(function (badgeType) {
    badgeType["Exhibitor_Badge"] = "exhibitor";
    badgeType["Exhibitor"] = "Exhibitor";
    badgeType["One_day_Badge"] = "One_day_Badge";
    badgeType["One_day_Pass"] = "One_day_Pass";
    badgeType["Delegate_Badge"] = "Delegate_Badge";
    badgeType["Delegate"] = "delegate";
    // FullDelegate= "fullDelegate"
})(badgeType || (exports.badgeType = badgeType = {}));
