from flask import Flask, jsonify, request
from flask_cors import CORS
import ipinfo
from scapy.all import traceroute

from secrets import IPINFO_TOKEN

app = Flask(__name__)
CORS(app)

ipinfo_handler = ipinfo.getHandler(IPINFO_TOKEN)

@app.route('/')
def index():
  return jsonify({
    "message": "¡Hola mundo en Flask!",
    "data": "",
    "status": 200
  })

@app.route('/my_location')
def my_location():
  ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
  details = ipinfo_handler.getDetails(ip_address)
  try:
    print(f'Ciudad de origen: {details.city}')
  except AttributeError:
    return jsonify({
      "message": "IP Privada, no se puede extraer datos GPS",
      "data": "",
      "status": 500
    })
  else:
    data = {
      "pais": details.country_name,
      "ciudad": details.city,
      "latitud": details.latitude,
      "longitud": details.longitude,
    }
    return jsonify({
      "message": "Localidad obtenida correctamente",
      "data": data,
      "status": 200
    })

@app.route('/tracert', methods=["POST"])
def tracert():
  url = request.json.get('url')
  if not url:
    return jsonify({
      "message": "URL no proporcionada",
      "data": "",
      "status": 400
    })

  try:
    result, _ = traceroute(url, maxttl=32)
    output = []

    for sent, received in result:
      hop_ip = received.src
      hop_time = received.time - sent.sent_time

      # Getting geolocation details for the hop IP
      details = ipinfo_handler.getDetails(hop_ip)
      try:
        print(f'Ciudad de origen: {details.city}')
      except AttributeError:
        print("No se pudo obtener la ubicacion de la ip: " + hop_ip)
        location_data = {
          "ip": hop_ip,
          "ms": hop_time * 1000,
          "lat": None,
          "lng": None
        }
        output.append(location_data)
      else:
        print(details.latitude)
        location_data = {
          "ip": hop_ip,
          "ms": hop_time * 1000,
          "lat": details.latitude,
          "lng": details.longitude
        }
        output.append(location_data)

    return jsonify({
      "message": "Traceroute completado",
      "data": output,
      "status": 200
    })

  except Exception as e:
    return jsonify({
      "message": f"Error al realizar el traceroute: {str(e)}",
      "data": "",
      "status": 500
    })

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=5000)