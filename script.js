// let dataWilayah = "";
fetch("https://ibnux.github.io/BMKG-importer/cuaca/wilayah.json")
  .then((res) => res.json())
  .then((data) => {
    let pilihProvinsi = document.getElementById("province");
    let pilihKota = document.getElementById("city");
    pilihKota.style.visibility = "hidden";
    let pilihKecamatan = document.getElementById("district");
    pilihKecamatan.style.visibility = "hidden";

    ///// menambahkan option pada tag select yang ber-id provinsi
    let daftarProvinsi = provinsi(data);
    let html = "";
    let i = 0;
    daftarProvinsi.forEach(function (provinsi) {
      if (i === 0) {
        html += `<option value="value">Pilih provinsi</option>`;
      }
      i++;
      html += `<option value="${provinsi}">${provinsi}</option>`;
    });
    pilihProvinsi.innerHTML = html;

    ///// menambahkan option pada tag select yang ber-id city
    let daftarKota = kota(data);
    pilihProvinsi.addEventListener("change", function () {
      pilihProvinsi.disabled = true;
      pilihKota.style.visibility = "visible";
      const provinsiTerpilih = pilihProvinsi.value;
      const kota = daftarKota.get(provinsiTerpilih);

      html = "";
      i = 0;
      kota.forEach(function (kota) {
        if (i === 0) {
          html += `<option value="value">Pilih Kota/Kab.</option>`;
        }
        i++;
        html += `<option value="${kota}">${kota}</option>`;
      });
      pilihKota.innerHTML = html;
    });

    ///// menambahkan option pada tag select yang ber-id district
    let daftarKecamatan = kecamatan(data);
    pilihKota.addEventListener("change", function () {
      pilihKota.disabled = true;
      pilihKecamatan.style.visibility = "visible";
      const kotaTerpilih = pilihKota.value;
      const kecamatan = daftarKecamatan.get(kotaTerpilih);

      html = "";
      i = 0;
      kecamatan.forEach(function (kecamatan) {
        if (i === 0) {
          html += `<option value="value">Pilih Kecamatan</option>`;
        }
        i++;
        html += `<option value="${kecamatan}">${kecamatan}</option>`;
      });
      pilihKecamatan.innerHTML = html;
    });

    /////
    pilihKecamatan.addEventListener("change", function () {
      console.log(pilihKecamatan.value);
    });

    let tomboltampil = document.getElementById("tombolTampil");
    tomboltampil.addEventListener("click", function () {
      tampilkanCuaca(data, pilihKecamatan.value);
    });

    let tombolReset = document.getElementById("tombolReset");
    tombolReset.addEventListener("click", function () {
      resetWilayah();
    });
  });

function provinsi(data) {
  try {
    const daftarProvinsi = new Set();
    data.forEach((data) => {
      daftarProvinsi.add(data.propinsi);
    });
    return daftarProvinsi;
  } catch (error) {
    console.log(error);
  }
}

function kota(data) {
  try {
    const provinsi = new Set();
    data.forEach((data) => {
      provinsi.add(data.propinsi);
    });
    const daftarKota = new Map();
    provinsi.forEach((provinsi) => {
      const kota = new Set();
      data.forEach((data) => {
        if (data.propinsi === provinsi) {
          kota.add(data.kota);
        }
      });
      daftarKota.set(provinsi, kota);
    });
    return daftarKota;
  } catch (error) {
    console.log(error);
  }
}

function kecamatan(data) {
  try {
    const kota = new Set();
    data.forEach((data) => {
      kota.add(data.kota);
    });

    const daftarKecamatan = new Map();
    kota.forEach((kota) => {
      const kecamatan = new Set();
      data.forEach((data) => {
        if (data.kota === kota) {
          kecamatan.add(data.kecamatan);
        }
      });
      daftarKecamatan.set(kota, kecamatan);
    });
    return daftarKecamatan;
  } catch (error) {
    console.log(error);
  }
}

async function cuaca(idWilayah) {
  let url = `https://ibnux.github.io/BMKG-importer/cuaca/${idWilayah}.json`;
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function tampilkanCuaca(data, wilayah) {
  try {
    let idWilayah = 0;
    data.forEach((data) => {
      if (data.kecamatan === wilayah) {
        idWilayah = data.id;
      }
    });
    console.log("idWilayah " + idWilayah);
    //const dataCuaca = await cuaca(data, idWilayah);
    let dataCuaca = await cuaca(idWilayah);
    console.log(dataCuaca);

    let html = "";
    let i = 1;
    dataCuaca.forEach((dCuaca) => {
      // ada missing data di data.cuaca = Cerah
      if (dCuaca.kodeCuaca === "0") {
        dCuaca.cuaca = "Cerah";
      }

      let jam = "";
      if (
        dCuaca.jamCuaca.slice(11, 13) === "00" ||
        dCuaca.jamCuaca.slice(11, 13) === "18"
      ) {
        jam = "pm";
      } else {
        jam = "am";
      }

      let jenisCuaca = dCuaca.cuaca.toLowerCase();

      if (i === 1) {
        html += `<div class="card card-1">
               <h2>Hari Ini (${dCuaca.jamCuaca.slice(0, 10)})</h2>`;
      } else if (i === 5) {
        html += `</div>
               <div class="card card-2">
               <h2>Besok (${dCuaca.jamCuaca.slice(0, 10)})</h2>`;
      } else if (i === 9) {
        html += `</div>
               <div class="card card-3">
               <h2>Lusa (${dCuaca.jamCuaca.slice(0, 10)})</h2>`;
      }

      if (i % 4 === 1) {
        let htmlSegment = `<div class="row">
                         <div class="column">
                         <h3>${dCuaca.jamCuaca.slice(11, 16)}</h3>
                         <img src="img/${jenisCuaca}-${jam}.png" width="50"/>
                         <h4>${dCuaca.cuaca}</h4>
                         <p>${dCuaca.tempC}°C || ${dCuaca.tempF}°F</p>
                         <h5>Kelembapan: ${dCuaca.humidity}%</h5>
                         </div>`;
        html += htmlSegment;
      } else if (i % 4 === 0) {
        let htmlSegment = `<div class="column">
                         <h3>${dCuaca.jamCuaca.slice(11, 16)}</h3>
                         <img src="img/${jenisCuaca}-${jam}.png" width="50"/>
                         <h4>${dCuaca.cuaca}</h4>
                         <p>${dCuaca.tempC}°C || ${dCuaca.tempF}°F</p>
                         <h5>Kelembapan: ${dCuaca.humidity}%</h5>
                         </div>
                         </div>`;
        html += htmlSegment;
      } else {
        let htmlSegment = `<div class="column">
                         <h3>${dCuaca.jamCuaca.slice(11, 16)}</h3>
                         <img src="img/${jenisCuaca}-${jam}.png" width="50"/>
                         <h4>${dCuaca.cuaca}</h4>
                         <p>${dCuaca.tempC}°C || ${dCuaca.tempF}°F</p>
                         <h5>Kelembapan: ${dCuaca.humidity}%</h5>
                         </div>`;
        html += htmlSegment;
      }
      if (i === 12) {
        html += `</div>`;
      }
      i++;
    });

    document.getElementById("tampil").innerHTML = html;
  } catch (error) {
    console.log(error);
  }
}

function resetWilayah() {
  let provinsiTerpilih = document.getElementById("province");
  provinsiTerpilih.disabled = false;
  provinsiTerpilih.value = "value";

  let kotaTerpilih = document.getElementById("city");
  kotaTerpilih.style.visibility = "hidden";
  kotaTerpilih.disabled = false;

  let kecamatanTerpilih = document.getElementById("district");
  kecamatanTerpilih.style.visibility = "hidden";
  kecamatanTerpilih.disabled = false;

  let tampil = document.getElementById("tampil");
  tampil.innerHTML = "";
}
