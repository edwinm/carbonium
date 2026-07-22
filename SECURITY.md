# Security Policy

## Supported versions

Carbonium is a small, single-file library. Security fixes are released for the
latest minor version only. Users are encouraged to stay on the latest release.

| Version | Supported          |
| ------- | ------------------ |
| 1.3.x   | :white_check_mark: |
| < 1.3   | :x:                |

## Reporting a vulnerability

Please **do not** report security issues through public GitHub issues.

Report privately through one of these channels:

- [GitHub private vulnerability reporting](https://github.com/edwinm/carbonium/security/advisories/new)
  (preferred)
- Email: edwin@bitstorm.org

Please include:

- A description of the issue and the impact you expect it to have
- The affected version of carbonium
- A minimal reproduction (a snippet of code plus the browser and version used)
- Any suggested fix, if you have one

You can expect an initial response within 14 days. If the report is confirmed, a
fix will be published as a new npm release and a GitHub security advisory. If you
would like credit, say so in your report.

## Security model

Carbonium wraps native DOM APIs in a `Proxy`; it does not implement its own
parser, sanitizer, or network layer. Anything you can do with carbonium, you can
do with `querySelectorAll` and plain element properties. Keep this in mind when
assessing risk:

- **Element creation is not sanitization.** `$("<div>…</div>")` passes the string
  to `DOMParser.parseFromString(…, "text/html")`. Inline `<script>` elements do
  not execute under `DOMParser`, but event-handler attributes (`onerror`,
  `onload`, …) and `javascript:` URLs in the parsed markup will run once the
  element is inserted into the document. Never pass untrusted or user-supplied
  strings to `$()` in creator mode; sanitize them first (for example with
  DOMPurify or the Sanitizer API).
- **Property writes propagate to every matched element.** Setting `innerHTML`,
  `outerHTML`, `src`, `href`, or `srcdoc` through carbonium has the same XSS
  characteristics as setting them directly, applied to the whole matched set.
  Prefer `textContent` for untrusted data.
- **Selectors are passed through unchanged** to `querySelectorAll`. Building a
  selector from untrusted input can throw or match unintended elements; it is not
  a code-execution vector, but validate input you do not control.
- **Trusted Types / CSP.** Carbonium adds no `eval`, `Function`, or inline
  script, so it is compatible with a strict Content Security Policy. Note that
  `DOMParser` usage in creator mode is not covered by Trusted Types
  enforcement — sanitize before calling `$()`.

## Out of scope

- Vulnerabilities in the demo pages under `demo/`, the test suite, or the build
  configuration, unless they affect the published package
- Issues that require passing attacker-controlled markup to `$()` (see above —
  that is documented behaviour, not a library defect)
- Bugs in browsers or in the underlying DOM APIs themselves
- Findings from automated scanners without a demonstrated impact on carbonium

## Supply chain

- Carbonium has **zero runtime dependencies**; the published package contains
  only `src/carbonium.ts` and the built bundles plus their source maps.
- All tooling is `devDependencies` and is pinned via `package-lock.json`
  (lockfile v3).
- The repository runs [CodeQL](.github/workflows/codeql.yml) with the
  `security-and-quality` query suite on every push and pull request to `master`,
  plus a weekly schedule.
- [OpenSSF Scorecard](.github/workflows/scorecard.yml) runs weekly and publishes
  its results; the badge is in the README.
- Additional continuous checks: Snyk, Socket.dev, SonarCloud and CodeFactor
  (badges in the README).

If you find a compromised or malicious dependency in the published package,
report it through the private channels above.
