showProvince();

//========================
async function getWilayah() {
  let url = "https://ibnux.github.io/BMKG-importer/cuaca/wilayah.json";
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function getCuaca(idWilayah) {
  let url = `https://ibnux.github.io/BMKG-importer/cuaca/${idWilayah}.json`;
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function getProvince() {
  let allData = await getWilayah();

  try {
    const province = new Set();
    allData.forEach((data) => {
      province.add(data.propinsi);
    });
    return province;
  } catch (error) {
    console.log(error);
  }
}

async function getCity() {
  let allData = await getWilayah();
  let allProvince = await getProvince();
  try {
    const cityInThisProvince = new Map();
    allProvince.forEach((province) => {
      const city = new Set();
      allData.forEach((data) => {
        if (data.propinsi === province) {
          city.add(data.kota);
        }
      });
      cityInThisProvince.set(province, city);
    });
    return cityInThisProvince;
  } catch (error) {
    console.log(error);
  }
}

async function getDistricts() {
  let allData = await getWilayah();

  const allCity = new Set();
  allData.forEach((data) => {
    allCity.add(data.kota);
  });

  try {
    const districInThisCity = new Map();
    allCity.forEach((city) => {
      const districts = new Set();
      allData.forEach((data) => {
        if (data.kota === city) {
          districts.add(data.kecamatan);
        }
      });
      districInThisCity.set(city, districts);
    });
    return districInThisCity;
  } catch (error) {
    console.log(error);
  }
}

async function showProvince() {
  let province = await getProvince();

  let html = "";
  let i = 0;
  province.forEach(function (provinceName) {
    if (i === 0) {
      html += `<option value="value">Pilih provinsi</option>`;
    }
    i++;
    html += `<option value="${provinceName}">${provinceName}</option>`;
  });

  let provinceOption = document.getElementById("province_list");
  provinceOption.innerHTML = html;
  let cityOption = document.getElementById("city_list");
  cityOption.style.visibility = "hidden";
  let districtOption = document.getElementById("district_list");
  districtOption.style.visibility = "hidden";
}

async function showCityInThisProv(province) {
  let cityInThisProvince = await getCity();
  const selectedProvince = cityInThisProvince.get(province);

  let html = "";
  let i = 0;
  selectedProvince.forEach(function (city) {
    if (i === 0) {
      html += `<option value="value">Pilih Kota/Kab.</option>`;
    }
    i++;
    html += `<option value="${city}">${city}</option>`;
  });

  let provinceOption = document.getElementById("province_list");
  provinceOption.disabled = true;
  let cityOption = document.getElementById("city_list");
  cityOption.innerHTML = html;
  cityOption.style.visibility = "visible";
}

async function showDistrictsInThisCity(city) {
  let districInThisCity = await getDistricts();
  const selectedCity = districInThisCity.get(city);

  let html = "";
  let i = 0;
  selectedCity.forEach(function (district) {
    if (i === 0) {
      html += `<option value="value">Pilih Kecamatan</option>`;
    }
    i++;
    html += `<option value="${district}">${district}</option>`;
  });

  let cityOption = document.getElementById("city_list");
  cityOption.disabled = true;
  let districtOption = document.getElementById("district_list");
  districtOption.innerHTML = html;
  districtOption.style.visibility = "visible";
}

// GET WEATHER DATA
async function fetchData() {
  let allData = await getWilayah();

  var get = document.getElementById("district_list");
  var dis = get.value;

  let idDistrict = 0;
  allData.forEach((data) => {
    if (data.kecamatan === dis) {
      idDistrict = data.id;
    }
  });

  let weather = await getCuaca(idDistrict);

  let html = "";
  let i = 1;
  weather.forEach((cuaca) => {
    if (i === 1) {
      html += `<h2>Hari Ini (${cuaca.jamCuaca.slice(0, 10)})</h2>`;
    } else if (i === 5) {
      html += `<h2>Besok (${cuaca.jamCuaca.slice(0, 10)})</h2>`;
    } else if (i === 9) {
      html += `<h2>Lusa (${cuaca.jamCuaca.slice(0, 10)})</h2>`;
    }
    if (i % 4 === 1) {
      let htmlSegment = `<div class="row">
                         <div class="column">
                         <h3>Pukul ${cuaca.jamCuaca.slice(11, 16)}</h3>
                         <h4>${cuaca.cuaca}</h4>
                         <p>Temperatur: ${cuaca.tempC}°C || ${cuaca.tempF}°F</p>
                         <p>=====================</p>
                         </div>`;
      html += htmlSegment;
    } else if (i % 4 === 0) {
      let htmlSegment = `<div class="column">
                         <h3>Pukul ${cuaca.jamCuaca.slice(11, 16)}</h3>
                         <h4>${cuaca.cuaca}</h4>
                         <p>Temperatur: ${cuaca.tempC}°C || ${cuaca.tempF}°F</p>
                         <p>=====================</p>
                         </div>
                         </div>`;
      html += htmlSegment;
    } else {
      let htmlSegment = `<div class="column">
                         <h3>Pukul ${cuaca.jamCuaca.slice(11, 16)}</h3>
                         <h4>${cuaca.cuaca}</h4>
                         <p>Temperatur: ${cuaca.tempC}°C || ${cuaca.tempF}°F</p>
                         <p>=====================</p>
                         </div>`;
      html += htmlSegment;
    }
    i++;
  });

  document.getElementById("tampil").innerHTML = html;
}

function resetOption() {
  let provinceOption = document.getElementById("province_list");
  provinceOption.disabled = false;
  provinceOption.value = "value";

  let cityOption = document.getElementById("city_list");
  cityOption.style.visibility = "hidden";
  cityOption.disabled = false;

  let districtOption = document.getElementById("district_list");
  districtOption.style.visibility = "hidden";
  districtOption.disabled = false;

  let tampil = document.getElementById("tampil");
  tampil.innerHTML = "";
}
