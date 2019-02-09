function htmlEscape(str) {
  return str
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\//g, '&#x2F;');
}

const encodeResult = document.getElementById('encodeResult');
const verifyResult = document.getElementById('verifyResult');

const renderError = error => `<span class="text-danger">
<i class="fas fa-exclamation-circle"></i><span class="error-text ml-1">${htmlEscape(
  error
)}</span>
</span>`;

const renderHash = response =>
  `<p class="hash bg-light p-4"><code>${htmlEscape(response.hash)}</code></p>
  <div class="time text-muted"><i class="fa fa-clock"></i><small class="ml-1">${htmlEscape(
    response.time
  )} ms</small></div>`;

function renderCompare(response) {
  const res = response.result
    ? `<p class="text-success"><i class="fas fa-check"></i><span class="ml-1">Match</span><p>`
    : `<p class="text-danger"><i class="fas fa-cross"></i><span class="ml-1">Does not match</span></p>`;

  return `
    ${res}
    <div class="time text-muted"><i class="fa fa-clock"></i><small class="ml-1">${htmlEscape(
      response.time
    )} ms</small></div>`;
}

document.getElementById('encodeForm').addEventListener('submit', async e => {
  e.preventDefault();

  const data = document.getElementById('plaintext').value;
  const rounds = parseInt(document.getElementById('rounds').value, 10);

  try {
    const req = await fetch('/encode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data,
        rounds
      })
    });

    const response = await req.json();
    if (req.ok) {
      encodeResult.innerHTML = renderHash(response);
    } else {
      encodeResult.innerHTML = renderError(response.error);
    }
  } catch (error) {
    encodeResult.innerHTML = renderError('An unexpected error occured');
  }
});

document.getElementById('decodeForm').addEventListener('submit', async e => {
  e.preventDefault();

  const data = document.getElementById('text').value;
  const hash = document.getElementById('hash').value;

  try {
    const req = await fetch('/decode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data,
        hash
      })
    });

    const response = await req.json();
    if (req.ok) {
      verifyResult.innerHTML = renderCompare(response);
    } else {
      verifyResult.innerHTML = renderError(response.error);
    }
  } catch (error) {
    verifyResult.innerHTML = renderError('An unexpected error occured');
  }
});
