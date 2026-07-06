dayjs.extend(window.dayjs_plugin_isSameOrBefore);

document.addEventListener('DOMContentLoaded', (event) => {
  const booking = document.querySelector('iframe');
  const header = document.querySelector('header');
  const form = document.querySelector('header form');
  const inField = form.querySelector('.check-in');
  const outField = form.querySelector('.check-out');
  const rangeField = form.querySelector('.range');
  const today = dayjs();
  const tomorrow = today.add(1, 'day');
  let startDate, endDate, locked;

  // Desktop version
  const checkIn = flatpickr(inField, {
    wrap: true,
    altInput: true,
    altFormat: "F j, Y",
    positionElement: inField,
    minDate: today.toDate(),
    onOpen() {
      if (!startDate) setDefaultStart();
    },
    onChange(selectedDates) {
      if (selectedDates.length === 1) {
        startDate = dayjs(selectedDates[0]);
        const minDate = startDate.add(1, 'day');
        checkOut.set('minDate', minDate.toDate());
        if (endDate?.isBefore(minDate)) {
          endDate = undefined;
          // checkOut.open();
        }
      } else {
        startDate = undefined;
        checkOut.set('minDate', tomorrow.toDate());
      }
    },
  });

  const checkOut = flatpickr(outField, {
    wrap: true,
    altInput: true,
    altFormat: "F j, Y",
    positionElement: outField,
    minDate: tomorrow.toDate(),
    onOpen() {
        if (!endDate) setDefaultEnd();
    },
    onChange(selectedDates) {
      if (selectedDates.length === 1) {
        endDate = dayjs(selectedDates[0]);
      } else {
        endDate = undefined;
      }
    }
  });

  // Mobile version
  const range = flatpickr(rangeField, {
    wrap: true,
    altInput: true,
    altFormat: "M j, Y",
    mode: "range",
    disableMobile: true,
    position: "above center",
    positionElement: rangeField,
    minDate: today.toDate(),
    onOpen() {
      locked = true;
    },
    onClose() {
      locked = false;
    },
    onChange(selectedDates, dateStr, instance) {
      if (selectedDates.length === 2) {
        startDate = dayjs(selectedDates[0]);
        endDate = dayjs(selectedDates[1]);
        instance.altInput.value = instance.altInput.value.replace(' to ', ' – ');
        submitForm();
      } else {
        startDate = undefined;
        endDate = undefined;
      }
    },
  });

  function setDefaultStart() {
    checkIn.setDate(today.toDate(), true);
  }

  function setDefaultEnd() {
    const nextDay = startDate ? startDate.add(1, 'day') : tomorrow;
    checkOut.setDate(nextDay.toDate(), true);
    // jumpToDate?
  }

  function setDefaultRange() {
    checkIn.setDate(today.toDate(), true);
    checkOut.setDate(tomorrow.toDate(), true);
    // jumpToDate?
    range.setDate([today.toDate(), tomorrow.toDate()], true);
  }

  function setDefaults() {
    if (!startDate && !endDate) setDefaultRange();
    else if (startDate && !endDate) setDefaultEnd();
    else if (!startDate) setDefaultStart();
  }

  function updateHeader() {
    if (locked) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const compact = scrollTop > 0;
    header.classList.toggle('compact', compact);
    range.config.position = `${compact ? 'below' : 'above'} center`;
    if (compact) setDefaults();
  }

  function refreshListing() {
    const start = (startDate || today).format('YYYY-MM-DD');
    const end = (endDate || tomorrow).format("YYYY-MM-DD");
    const url = `https://nobeds.app/onepage/1508198264/1/${start}/${end}`;
    if (booking.src !== url) booking.src = url;
  }

  function handleScroll() {
    checkIn.close();
    checkOut.close();
    updateHeader();
  }

  function submitForm() {
    header.classList.add('compact');
    window.scrollTo(0, 1);
    updateHeader();
    refreshListing();
  }

  // TODO: Listen for reservation details (hide header)
  // TODO: Add styles for success and sold out

  window.scrollTo(0, 0);
  updateHeader();
  refreshListing();

  window.addEventListener('message', event => {
    if (event.origin !== 'https://nobeds.app/') return;
    if (event.data) console.log('Message received:', event.data);
  });

  window.addEventListener('scroll', handleScroll, { passive: true });

  form.addEventListener('submit', event => {
    event.preventDefault();
    submitForm();
  });
});
