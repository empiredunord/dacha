function isIframe() {
  try {
    return window.self !== window.top;
  } catch {
    // Cross-origin access restrictions imply we're inside an iframe.
    return true;
  }
}

if (window.location.href.toLowerCase().includes('/onepage/')) {
  if (!isIframe()) {
    document.documentElement.className = 'loading';
    window.location.href = 'https://dachapai.com/';
  }

  document.documentElement.className = 'booking-page';

  document.querySelectorAll('.card-title').forEach(el => {
    el.innerHTML = el.innerText.trim();
    el.style.whiteSpace = 'normal';
    el.removeAttribute('title');
  });

  document.querySelectorAll('.card-title, .hero-heading').forEach(el => {
    el.innerHTML = el.innerHTML.replace(/[\d-]+\. /, '');
  });

  document.querySelectorAll('.card-body .list-inline,  .text-block .list-inline').forEach(container => {
    const el = {};
    container.querySelectorAll('.list-inline-item').forEach(item => {
        if (item.innerText.toLowerCase().includes('bed')) el.beds = item;
        if (item.innerText.toLowerCase().includes('guest')) el.guests = item;
        if (item.innerText.toLowerCase().includes('bathroom')) el.bathrooms = item;
    });

    if (el.bathrooms?.innerHTML.includes('Bathroom')) {
        el.bathrooms.innerHTML = el.bathrooms.innerHTML.replace('Bathroom', 'Private bathroom');
    }

    const list = [el.guests, el.beds, el.bathrooms];
    container.replaceChildren(...list.filter(Boolean));
  });

  document.querySelectorAll('.h4.text-primary').forEach(el => {
    if (el.innerHTML.includes('THB')) {
        el.innerHTML = el.innerHTML.replace(/^(THB)([\d]+)$/, '$2 $1');
    }
  });

  const address = document.querySelector('.form-group:has(label[for="address"])');
  const country = document.querySelector('.form-group:has(label[for="country"])');
  if (country && address) country.after(address);

  document.querySelectorAll('.card-text.text-muted, .list-group-item strong').forEach(el => {
    el.innerHTML = 'Pay at the property';
  });

  document.querySelectorAll('.col-lg-7.col-xl-5 form button[type="submit"]').forEach(el => {
    el.innerHTML = 'Submit';
  });
}
