const buttonManager = require("buttons");
const http = require("http");

const togglePauseUrl = "http://192.168.137.5:8123/api/services/media_player/media_play_pause";
const tvStateUrl = "http://192.168.137.5:8123/api/states/media_player.samsung";
const hasToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhZjI5ZDNjNDA1OGM0ZjFiYTAwMzJlN2VhYjdiODI2ZCIsImlhdCI6MTY4MTY3NzMzMSwiZXhwIjoxOTk3MDM3MzMxfQ.AjozGyWzW9rgk5CJwya389DNhw4m7a_o8SLjmpbIucE";
const kitchenButtonSerial = "BH01-D39071";
const headers = {"Content-Type": "application/json", "Authorization": "Bearer " + hasToken};

function onSingleClick() {
  console.log("" + new Date() + " kitchen button click");

  http.makeRequest({
    url: tvStateUrl,
    method: "GET",
    headers: headers,
  }, function(err, res) {
    console.log("tv state response", err, res.content);
    const data = JSON.parse(res.content);
    const entityId = data.state === "on" ? "media_player.samsung" : "media_player.arc";

    http.makeRequest({
      url: togglePauseUrl,
      method: "POST",
      headers: headers,
      content: JSON.stringify({"entity_id": entityId}),
    }, function(err, res) {
      console.log("request status: ", err, res.content);
    });
  });
}

buttonManager.on("buttonSingleOrDoubleClickOrHold", function(obj) {
  const button = buttonManager.getButton(obj.bdaddr);
  if (button.serialNumber === kitchenButtonSerial && obj.isSingleClick) {
    onSingleClick();
  }
});

console.log("" + new Date() + " kitchen button started");
