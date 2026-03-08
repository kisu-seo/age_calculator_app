/**
 * @file script.js
 * @description 나이 계산기 애플리케이션의 핵심 로직
 *
 * [아키텍처 개요]
 * 이 파일은 다음 세 가지 관심사(Concern)를 명확히 분리하여 구현합니다.
 *   1. 상태 관리 (State Management): `state` 객체가 입력값과 에러 상태를 단일 소스로 관리
 *   2. 비즈니스 로직 (Business Logic): `getValidationErrors()`가 DOM과 독립적으로 유효성을 판단
 *   3. UI 렌더링 로직 (UI Logic): `renderErrors()`가 state를 읽어 DOM을 갱신
 *
 * [설계 원칙]
 * - DRY (Don't Repeat Yourself): DOM 요소를 `fields` 배열로 관리하여 3개 필드의 반복 로직을 제거
 * - 단방향 데이터 흐름: 이벤트 → state 갱신 → DOM 렌더링 순서를 일관되게 유지
 */


/* ================================================================
   DOM 요소 초기화
   - 각 입력 필드의 관련 요소(field, input, errorSpan)를 객체 배열로 묶어 관리합니다.
   - fields 배열을 사용하면 3개 필드에 대한 동일한 작업을 forEach 하나로
     처리할 수 있어, 필드 추가/삭제 시 유지보수 비용이 최소화됩니다.
================================================================ */

/**
 * @type {Array<{ key: string, field: HTMLElement, input: HTMLInputElement, errorSpan: HTMLElement }>}
 * @description 각 입력 필드의 DOM 요소를 구조화된 객체 배열로 관리합니다.
 *   `key`는 state 객체의 속성명과 1:1 대응되어 렌더링 로직을 단순화합니다.
 */
const fields = [
  {
    key: 'day',
    field: document.getElementById('field-day'),
    input: document.getElementById('input-day'),
    errorSpan: document.getElementById('error-day'),
  },
  {
    key: 'month',
    field: document.getElementById('field-month'),
    input: document.getElementById('input-month'),
    errorSpan: document.getElementById('error-month'),
  },
  {
    key: 'year',
    field: document.getElementById('field-year'),
    input: document.getElementById('input-year'),
    errorSpan: document.getElementById('error-year'),
  },
];

/**
 * @type {Map<string, object>}
 * @description key('day' | 'month' | 'year')로 필드 객체를 O(1) 시간에 접근하기 위한 인덱스 맵.
 *   배열 탐색(O(n)) 대신 Map을 사용하여 특정 필드 조회 성능을 최적화합니다.
 */
const fieldMap = new Map(fields.map(f => [f.key, f]));

/**
 * @type {{ years: HTMLElement, months: HTMLElement, days: HTMLElement }}
 * @description 계산 결과를 출력하는 span 요소들.
 *   key가 calculateAge() 반환 객체의 속성명과 일치하도록 설계하여,
 *   displayResults()에서 Object.entries 반복만으로 렌더링이 가능합니다.
 */
const resultEls = {
  years: document.getElementById('result-years'),
  months: document.getElementById('result-months'),
  days: document.getElementById('result-days'),
};

/** @type {HTMLFormElement} */
const form = document.getElementById('age-form');


/* ================================================================
   상태 관리 (State Management)
   - `state`는 이 애플리케이션의 유일한 진실의 원천(Single Source of Truth)입니다.
   - values: 사용자가 입력한 원시 문자열 값 (파싱 전)
   - errors: 각 필드의 에러 상태
       null   → 에러 없음 (정상 상태)
       string → 에러 있음 (표시할 메시지, 빈 문자열 ''은 테두리만 표시)
================================================================ */

/**
 * @type {{ values: object, errors: object }}
 */
let state = {
  values: { day: '', month: '', year: '' },
  errors: { day: null, month: null, year: null },
};

/**
 * @description 각 입력 요소의 현재 값을 읽어 state.values를 동기화합니다.
 *   폼 제출 이벤트 핸들러에서 유효성 검사 직전에 호출하여
 *   state가 항상 최신 입력값을 반영하도록 보장합니다.
 */
function updateStateValues() {
  fields.forEach(({ key, input }) => {
    state.values[key] = input.value.trim();
  });
}


/* ================================================================
   UI 렌더링 로직
   - DOM 조작은 오직 이 계층의 함수들만 수행합니다.
   - state 객체를 읽어 DOM을 갱신하는 단방향 데이터 흐름을 따릅니다.
================================================================ */

/**
 * @description state.errors를 읽어 모든 입력 필드의 에러 UI를 일괄 갱신합니다.
 *
 * [에러 상태 렌더링 규칙]
 *   - null  → has-error 클래스 제거, aria-invalid="false", 에러 메시지 비우기
 *   - ''    → has-error 클래스 추가 (테두리 빨간색), 에러 메시지는 비어있음
 *   - 문자열 → has-error 클래스 추가, 에러 메시지 표시
 *
 * [접근성 구현]
 *   - aria-invalid: 스크린 리더에게 입력값의 유효성 여부를 전달합니다.
 *     "true"로 설정되면 스크린 리더는 사용자에게 입력값이 올바르지 않음을 알립니다.
 *   - errorSpan의 role="alert"와 aria-live="polite" (HTML에서 선언)와 조합되어,
 *     텍스트 내용이 바뀌는 순간 스크린 리더가 메시지를 자동으로 읽어줍니다.
 */
function renderErrors() {
  fields.forEach(({ key, field, input, errorSpan }) => {
    const message = state.errors[key];
    if (message !== null) {
      field.classList.add('has-error');
      input.setAttribute('aria-invalid', 'true');
      errorSpan.textContent = message;
    } else {
      field.classList.remove('has-error');
      input.setAttribute('aria-invalid', 'false');
      errorSpan.textContent = '';
    }
  });
}

/**
 * @description 모든 필드의 에러 상태를 null로 초기화하고 DOM에 반영합니다.
 *   폼 제출 시 이전 에러를 지우고 새로운 검증을 시작하기 전에 호출됩니다.
 */
function clearAllErrors() {
  state.errors = { day: null, month: null, year: null };
  renderErrors();
}


/* ================================================================
   비즈니스 로직 — 유효성 검사
   - DOM에 직접 접근하지 않아 단위 테스트가 가능한 순수 함수(Pure Function)에 가깝게 설계했습니다.
   - 검증 순서: 빈칸 → 형식/범위 → 미래 날짜(연→월→일 순) → 달력 존재 여부
================================================================ */

/**
 * @description 현재 state.values를 기반으로 유효성을 검사하고 에러 결과 객체를 반환합니다.
 *
 * [검증 아키텍처: 조기 종료(Early Return) 회피]
 *   기존 설계의 문제점: 중간에 `return false`를 사용하면 DAY 에러 발생 시
 *   YEAR 필드의 미래 날짜 검증이 실행되지 않는 누락 버그가 발생했습니다.
 *   해결책: 각 필드를 완전히 독립적으로 검사하여 모든 에러를 수집한 뒤 반환합니다.
 *
 * [에러값 규약]
 *   null   → 에러 없음
 *   문자열 → 표시할 에러 메시지
 *   ''     → 달력 날짜 검증 실패 시, 연/월 필드는 테두리만 빨갛게 표시
 *
 * @returns {{ day: string|null, month: string|null, year: string|null }}
 */
function getValidationErrors() {
  const { day: dayStr, month: monthStr, year: yearStr } = state.values;
  const errors = { day: null, month: null, year: null };

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; /* getMonth()는 0-based이므로 +1 보정 */
  const currentDay = today.getDate();

  /* --- 1. Day 독립 검사 --- */
  const day = parseInt(dayStr, 10);
  if (dayStr === '') {
    errors.day = 'This field is required';
  } else if (isNaN(day) || day < 1 || day > 31) {
    /* 1~31 범위 외의 값 차단. 달별 실제 일수는 6번 검사에서 처리 */
    errors.day = 'Must be a valid day';
  }

  /* --- 2. Month 독립 검사 --- */
  const month = parseInt(monthStr, 10);
  if (monthStr === '') {
    errors.month = 'This field is required';
  } else if (isNaN(month) || month < 1 || month > 12) {
    errors.month = 'Must be a valid month';
  }

  /* --- 3. Year 독립 검사 --- */
  const year = parseInt(yearStr, 10);
  if (yearStr === '') {
    errors.year = 'This field is required';
  } else if (isNaN(year) || year < 1) {
    errors.year = 'Must be a valid year';
  } else if (year > currentYear) {
    /* 미래 연도 차단 */
    errors.year = 'Must be in the past';
  }

  /* --- 4. 올해 내 미래 날짜 검사 (연도가 유효하고 올해인 경우에만 실행) ---
     연도가 올해와 같을 때, 월과 일을 현재 날짜와 비교합니다.
     이 검사는 연도의 에러가 없을 때만 의미가 있으므로 중첩 조건으로 처리합니다. */
  if (errors.year === null && year === currentYear) {
    if (errors.month === null && month > currentMonth) {
      errors.month = 'Must be in the past';
    } else if (errors.month === null && month === currentMonth && errors.day === null) {
      if (day > currentDay) {
        errors.day = 'Must be in the past';
      }
    }
  }

  /* --- 5. 달력 존재 여부 검사 (윤년, 각 월의 마지막 날 포함) ---
     세 필드가 형식/범위/미래 검사를 모두 통과했을 때만 실행합니다.
     Date 생성자 특성 활용: new Date(2023, 3, 31)은 4월에 31일이 없으므로
     자동으로 5월 1일(month: 4)로 오버플로우됩니다.
     생성된 날짜의 각 속성이 입력값과 다르면 유효하지 않은 날짜임을 판별합니다.
     이 기법은 getTime() 비교보다 간결하고 윤년 엣지 케이스를 자동으로 처리합니다. */
  if (errors.day === null && errors.month === null && errors.year === null) {
    const testDate = new Date(year, month - 1, day);
    const isReal =
      testDate.getFullYear() === year &&
      testDate.getMonth() === month - 1 &&
      testDate.getDate() === day;

    if (!isReal) {
      /* UX 설계: 3개 필드 모두 에러 상태로 강조하되,
         메시지는 Day에만 표시하여 사용자에게 명확한 단일 피드백을 제공합니다. */
      errors.day = 'Must be a valid date';
      errors.month = ''; /* 빈 문자열: 에러 테두리만 표시 (메시지 없음) */
      errors.year = '';
    }
  }

  return errors;
}


/* ================================================================
   나이 계산 로직
================================================================ */

/**
 * @description 입력된 생년월일과 오늘 날짜를 비교하여 만 나이를 연/월/일로 계산합니다.
 *
 * [Edge Case 처리]
 *   빼기 연산 결과 일(days)이나 월(months)이 음수가 될 수 있습니다.
 *   예시) 오늘이 3월 5일이고 생일이 3월 20일이면 days = 5 - 20 = -15
 *   이 경우 이전 달/연도에서 빌려오는(borrowing) 방식으로 보정합니다.
 *   이전 달의 일수를 new Date(year, month, 0).getDate()로 구하면
 *   윤년(2월 29일)과 월별 일수 차이를 별도 테이블 없이 처리할 수 있습니다.
 *
 * @param {number} birthDay   - 생일의 일(1-31)
 * @param {number} birthMonth - 생일의 월(1-12)
 * @param {number} birthYear  - 생일의 연도
 * @returns {{ years: number, months: number, days: number }} 만 나이 (연/월/일)
 */
function calculateAge(birthDay, birthMonth, birthYear) {
  const today = new Date();
  let years = today.getFullYear() - birthYear;
  let months = today.getMonth() + 1 - birthMonth;
  let days = today.getDate() - birthDay;

  /* 일이 음수: 이전 달의 마지막 날 수를 빌려옴 */
  if (days < 0) {
    const prevMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonthDays;
    months -= 1;
  }

  /* 월이 음수: 이전 연도에서 12개월을 빌려옴 */
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days };
}


/* ================================================================
   카운트업 애니메이션
================================================================ */

/**
 * @description 숫자 요소를 0에서 목표값까지 지정된 시간 동안 증가시키는 애니메이션.
 *
 * [requestAnimationFrame 선택 이유]
 *   setTimeout/setInterval은 JavaScript 이벤트 루프에 의해 지연될 수 있으며,
 *   브라우저의 렌더링 주기(보통 60fps = 약 16.67ms 간격)와 동기화되지 않습니다.
 *   requestAnimationFrame은 브라우저 페인팅 직전에 콜백을 호출하므로
 *   화면 갱신 주기와 완전히 동기화되어 불필요한 렌더링 낭비 없이 부드러운 애니메이션을 구현합니다.
 *   또한 탭이 비활성화되면 자동으로 일시 정지되어 성능을 절약합니다.
 *
 * [Ease-out 보간 적용]
 *   progress^3 곡선을 사용하면 초반에 빠르게 증가하다 목표값에 가까워질수록 감속합니다.
 *   선형(linear) 보간보다 시각적으로 더 자연스럽고, 사용자의 주의를 결과에 집중시킵니다.
 *
 * @param {HTMLElement} element     - 숫자를 출력할 대상 DOM 요소
 * @param {number}      targetValue - 최종 목표 숫자
 * @param {number}      [duration=900] - 애니메이션 총 지속 시간 (단위: ms)
 */
function animateCount(element, targetValue, duration = 900) {
  const startTime = performance.now(); /* performance.now()는 DOMHighResTimeStamp로 밀리초 단위 고정밀 시간을 반환 */

  /**
   * @description 매 프레임마다 rAF에 의해 호출되는 내부 업데이트 함수.
   * @param {DOMHighResTimeStamp} currentTime - requestAnimationFrame이 전달하는 현재 타임스탬프
   */
  function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3); /* Ease-out cubic 보간 */
    element.textContent = Math.floor(easeOut * targetValue);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      /* progress가 정확히 1.0이 되지 않을 수 있는 부동소수점 오차를 방지하기 위해
         루프 종료 시 목표값을 직접 할당합니다. */
      element.textContent = targetValue;
    }
  }

  requestAnimationFrame(update);
}


/* ================================================================
   결과 영역 렌더링
================================================================ */

/**
 * @description 계산된 나이 객체를 받아 결과 영역에 카운트업 애니메이션과 함께 출력합니다.
 *   Object.entries()를 활용하여 resultEls의 key와 age 객체의 key를 매핑합니다.
 *
 * @param {{ years: number, months: number, days: number }} age - calculateAge()의 반환값
 */
function displayResults(age) {
  Object.entries(resultEls).forEach(([key, el]) => {
    el.classList.remove('empty'); /* 초기 '--' 상태의 스타일 클래스 제거 */
    animateCount(el, age[key], 900);
  });
}

/**
 * @description 결과 영역을 초기 '--' 상태로 되돌립니다.
 *   페이지 최초 로드 시 또는 유효성 검사 실패 시 호출되어,
 *   이전 계산 결과가 잘못된 입력 상태에서 그대로 표시되지 않도록 보장합니다.
 */
function resetResults() {
  Object.values(resultEls).forEach(el => {
    el.textContent = '--';
    el.classList.add('empty');
  });
}


/* ================================================================
   이벤트 바인딩
================================================================ */

/**
 * @description 폼 제출 이벤트 핸들러.
 *
 * [처리 순서]
 *   1. event.preventDefault(): <form>의 기본 동작(페이지 리로드)을 억제합니다.
 *      novalidate 속성(HTML)과 함께 브라우저 내장 검증을 완전히 비활성화하고
 *      이 핸들러에서 모든 검증을 직접 제어합니다.
 *   2. updateStateValues(): 이벤트 발생 시점의 입력값을 state에 동기화합니다.
 *   3. getValidationErrors(): 비즈니스 로직만 실행 (DOM 접근 없음)
 *   4. renderErrors(): state.errors를 읽어 DOM을 갱신 (UI 로직)
 *   5. 최종 isValid 판단 후 분기 처리
 */
form.addEventListener('submit', function (event) {
  event.preventDefault();

  updateStateValues();
  state.errors = getValidationErrors();
  renderErrors();

  /* Object.values로 모든 에러를 배열로 변환하고, every()로 null 여부를 한 번에 확인 */
  const isValid = Object.values(state.errors).every(e => e === null);

  if (isValid) {
    const { day, month, year } = state.values;
    const age = calculateAge(
      parseInt(day, 10),
      parseInt(month, 10),
      parseInt(year, 10)
    );
    displayResults(age);
  } else {
    /* 검증 실패 시 결과를 초기화하여, 직전 계산 결과(성공)가 잘못된 입력과 함께
       화면에 남아있는 오해의 소지를 제거합니다. */
    resetResults();
  }
});

/**
 * @description 각 입력 필드에 'input' 이벤트를 등록하여, 사용자가 수정을 시작하는 즉시
 *   해당 필드의 에러 상태를 초기화합니다.
 *
 * [UX 전략]
 *   submit 이벤트에서만 전체 재검증을 하고, 입력 중에는 해당 필드의 에러만 해제합니다.
 *   이는 사용자가 수정 중인 필드에 즉각적인 피드백(에러 해제)을 주면서도,
 *   다른 필드로 인한 에러 표시는 건드리지 않아 혼란을 방지합니다.
 *   ('change' 이벤트 대신 'input'을 쓰는 이유: 포커스를 잃기 전에도 즉시 반응)
 */
fields.forEach(({ key, field, input, errorSpan }) => {
  input.addEventListener('input', function () {
    state.errors[key] = null;
    field.classList.remove('has-error');
    input.setAttribute('aria-invalid', 'false');
    errorSpan.textContent = '';
  });
});


/* ================================================================
   초기화
================================================================ */

/**
 * @description DOMContentLoaded 이후 결과 영역을 초기 '--' 상태로 설정합니다.
 *   HTML에 정적으로 '--' 텍스트를 작성하는 대신 JS로 초기화하는 이유:
 *   JS가 비활성화된 환경(접근성, 검색 엔진 등)에서도 구조가 올바르게 렌더링되도록
 *   HTML은 의미론적으로 비어있는 상태를 유지하고, JS가 상태를 주입합니다.
 */
document.addEventListener('DOMContentLoaded', resetResults);
