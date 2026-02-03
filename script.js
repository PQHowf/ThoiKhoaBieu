fetch("data.json")
  .then((r) => r.json())
  .then((data) => {
    const table = document.getElementById("timetable");

    data.forEach((item) => {
      const slot = document.createElement("div");
      slot.className = "slot";

      slot.style.gridColumn = item.thu;
      slot.style.gridRow = item.ca + 1;

      slot.innerHTML = `
        <strong>${item.mon}</strong>
        <span>${item.nhom}</span><br>
        <span>${item.phong}</span><br>
        <span>${item.tiet}</span><br>
        <span>${item.gio}</span>
      `;

      table.appendChild(slot);
    });
  });

fetch("data.json")
  .then((r) => r.json())
  .then((data) => {
    const slot = getNextSlot(data);

    if (!slot) return;

    const now = getVNTime();
    let thu = now.getDay();
    if (thu === 0) thu = 7;
    else thu += 1;

    document.getElementById("today").innerText = `Hôm nay • Thứ ${thu}`;

    document.getElementById("today-info").innerText =
      now.toLocaleDateString("vi-VN") + " — Tiết học tiếp theo";

    document.getElementById("current-class").innerHTML = `
      <div class="tile">
        <span>Môn</span>
        <strong>${slot.mon}</strong>
      </div>

      <div class="tile">
        <span>Phòng</span>
        <strong>${slot.phong}</strong>
      </div>

      <div class="tile">
        <span>Tiết</span>
        <strong>${slot.tiet}</strong>
      </div>

      <div class="tile">
        <span>Giờ</span>
        <strong>${slot.gio}</strong>
      </div>
    `;
  });

function getVNTime() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
  );
}

function getNextSlot(slots) {
  const now = getVNTime();
  const today = now.getDay() === 0 ? 7 : now.getDay();

  const enriched = slots.map((s) => {
    let diff = s.thu - today;
    if (diff < 0) diff += 7;

    const [h, m] = s.gio.split("-")[0].split(":");

    const d = new Date(now);
    d.setDate(now.getDate() + diff);
    d.setHours(+h, +m, 0, 0);

    return {
      ...s,
      time: d.getTime(),
    };
  });

  const future = enriched.filter((e) => e.time > now.getTime());

  future.sort((a, b) => a.time - b.time);

  return future[0];
}

