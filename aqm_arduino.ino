#include <WiFi.h>
#include <HTTPClient.h>
#include <SoftwareSerial.h>
#include <Wire.h>
#include <Adafruit_AHTX0.h>
#include <SDS011.h>


const char* SSID = "Airtel_Mobin Banu";
const char* PASSWORD = "Toshiba75*";


const char* THINGSPEAK_SERVER = "api.thingspeak.com";
const String API_KEY = "CU0U95KLZSHP56MN";


#define SDS_RX 14
#define SDS_TX 12


SoftwareSerial sdsSerial(SDS_RX, SDS_TX);
Adafruit_AHTX0 aht;
SDS011 my_sds;


long lastTime = 0;
const unsigned long DELAY = 20000;

float p10, p25;
int error;

bool sendToThingSpeak(float temp, float humidity, float pm25, float pm10) {
  if (WiFi.status() != WL_CONNECTED) {
    return false;
  }
  
  HTTPClient http;
  String url = "http://api.thingspeak.com/update?api_key=" + API_KEY;
  url += "&field1=" + String(temp);
  url += "&field2=" + String(humidity);
  url += "&field3=" + String(pm25);
  url += "&field4=" + String(pm10);
  
  http.begin(url);
  int httpCode = http.GET();
  http.end();
  
  return (httpCode == 200);
}

void setup() {
  Serial.begin(115200);


  my_sds.begin(SDS_RX, SDS_TX);


  if (!aht.begin()) {
    Serial.println("Could not find AHT10 sensor!");
    while (1) delay(10);
  }


  WiFi.begin(SSID, PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");
}

void loop() {
  if ((millis() - lastTime) > DELAY) {

    sensors_event_t humidity, temp;
    aht.getEvent(&humidity, &temp);


    error = my_sds.read(&p25, &p10);
    
    if (!error) {
      Serial.println("Temperature: " + String(temp.temperature) + " °C");
      Serial.println("Humidity: " + String(humidity.relative_humidity) + " %");
      Serial.println("PM2.5: " + String(p25) + " µg/m³");
      Serial.println("PM10: " + String(p10) + " µg/m³");
      

      bool sent = sendToThingSpeak(
        temp.temperature,
        humidity.relative_humidity,
        p25,
        p10
      );
      
      if (sent) {
        Serial.println("Data sent to ThingSpeak successfully");
      } else {
        Serial.println("Failed to send data to ThingSpeak");
      }
    } else {
      Serial.println("Error reading PM data from SDS011");
    }

    lastTime = millis();
  }
  

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi connection lost. Reconnecting...");
    WiFi.reconnect();
  }
}