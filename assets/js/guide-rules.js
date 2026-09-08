/* Reading guidance only. No personal data, tax calculation or eligibility decision. */
(function (scope) {
  'use strict';
  const result = (title, recommendations) => ({type: 'result', title, recommendations});
  const ordinary = reason => ({id: 'ordinary', reason});
  const publicPlan = reason => ({id: 'public', reason});
  const social = reason => ({id: 'social', reason});
  const personal = reason => ({id: 'personal', reason});
  const question = (title, choices) => ({type: 'question', title, choices});
  const choices = (value, label, next) => ({value, label, next});

  const privateOwner = question('您是這間住宅的自然人所有權人嗎？', [
    choices('yes', '是，以個人名義持有', result('可先了解個人租賃住宅包租代管', [personal('您希望委託業者，且住宅以個人名義持有；接著確認業者是否合法、契約是否供居住使用一年以上。')])),
    choices('no', '不是，例如公司持有或非所有權人', result('先確認出租人身分與出租方式', [ordinary('個人包租代管優惠有自然人所有權人的限制，可先看一般出租規定；非所有權人的情況請洽主管機關。'), social('若住宅為法人所有且願意加入政府計畫，可另了解社宅包租代管；各稅目對出租人的限制不同。')])),
    choices('unsure', '不確定', result('先了解委託方案，再確認所有權人身分', [personal('這個方向符合委託業者的需求，但自然人所有權人、合法業者與契約條件仍待確認。')]))
  ]);
  const program = question('您想加入政府計畫，還是自行選擇業者？', [
    choices('government', '加入政府社會住宅包租代管計畫', result('可先了解社會住宅包租代管', [social('您希望透過政府計畫委託管理；可先洽合作業者確認房屋、承租人與契約條件。')])),
    choices('private', '自行選擇合法租賃住宅服務業', privateOwner),
    choices('unsure', '還不確定兩者差別', result('先比較兩種委託方式', [social('政府計畫由合作業者媒合管理，房屋、承租人與契約依計畫規定。'), personal('自行委託合法業者；須另確認自然人所有權人及一年以上住宅使用契約等條件。')]))
  ]);
  const subsidy = question('房客是否符合或已取得租金補貼資格？', [
    choices('yes', '符合資格，或已取得補貼', result('可先了解公益出租人', [publicPlan('您提到房客的租金補貼資格；先查認定情形，再核對各稅目的條件與適用期間。')])),
    choices('no', '沒有', result('可先了解一般出租', [ordinary('目前未有房客補貼的線索，可先確認租金標準與一般出租的申報規定。')])),
    choices('unsure', '不確定房客的補貼資格', result('先保留這兩個方向', [publicPlan('房客的補貼資格尚未確認，可先了解認定條件，不能直接視為已適用。'), ordinary('同時了解一般出租的租金標準與申報方式，不必等補貼確認才開始查資料。')]))
  ]);
  const priorities = question('接下來，您比較希望怎麼出租？', [
    choices('self', '自行找房客與管理', result('先從一般出租開始了解', [ordinary('您偏好自行管理，可先確認租金標準；若確認房客符合補貼資格，再查公益出租人認定。')])),
    choices('service', '希望有人協助招租與管理', result('可先比較兩種委託方式', [social('如果願意加入政府計畫，可先洽計畫合作業者。'), personal('若想自行選擇合法業者，請核對自然人所有權人與契約條件。')])),
    choices('unsure', '還沒有決定', result('先比較自行管理與政府計畫', [ordinary('先了解自行出租需要處理的申報與租金標準。'), social('再了解政府計畫能協助的招租與管理；也可在完整比較中查看個人包租代管。')]))
  ]);
  const unknownSubsidy = question('目前的房客是否符合或已取得租金補貼資格？', [
    choices('yes', '符合資格，或已取得補貼', result('可先從公益出租人了解', [publicPlan('您已有房客補貼的明確線索，可先確認公益出租人認定與各項優惠條件。')])),
    choices('no', '沒有，或還沒有房客', priorities),
    choices('unsure', '不確定', priorities)
  ]);
  const root = question('您想由誰處理招租與日常管理？', [
    choices('self', '我自己處理', subsidy),
    choices('service', '想委託業者處理', program),
    choices('unsure', '還不確定，想先了解', unknownSubsidy)
  ]);
  function next(answers = []) {
    let state = root;
    for (const answer of answers) {
      if (state.type !== 'question') throw new Error('Guidance already complete');
      const option = state.choices.find(item => item.value === answer);
      if (!option) throw new Error('Unknown guidance option');
      state = option.next;
    }
    if (answers.length > 3 || (answers.length === 3 && state.type !== 'result')) throw new Error('Guidance exceeds three questions');
    return {...state, step: answers.length + 1};
  }
  scope.RentalGuideRules = Object.freeze({next});
})(typeof window !== 'undefined' ? window : globalThis);
