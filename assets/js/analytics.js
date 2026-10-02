(function (root) {
  'use strict';

  var CONTRACT = {
    audience_select: {audience: ['owner', 'tenant']},
    plan_select: {plan_id: ['ordinary', 'public', 'social', 'personal']},
    guide_start: {audience: ['owner']},
    guide_complete: {
      result_type: ['single', 'multiple'],
      result_plan: ['ordinary', 'public', 'social', 'personal', 'multiple'],
      recommendation_count: 'integer'
    },
    cx_open: {entry_point: ['hero_button', 'floating_bubble']},
    cx_query_submit: {input_method: ['manual', 'quick_topic'], topic_id: ['rent_subsidy', 'tax_benefits', 'application_process', 'tenant_rights']},
    cx_source_click: {destination_host: 'host'},
    cx_error: {error_code: 'scalar', error_status: 'scalar'},
    service_entry_click: {service_id: ['income_standard'], destination_host: 'host'}
  };

  function isAllowed(value, rule) {
    if (Array.isArray(rule)) return rule.indexOf(value) !== -1;
    if (rule === 'integer') return Number.isInteger(value) && value >= 0;
    if (rule === 'host') return typeof value === 'string' && /^[a-z0-9.-]+$/i.test(value) && value.length <= 253;
    return (typeof value === 'string' || typeof value === 'number') && String(value).length <= 80;
  }

  function track(eventName, parameters) {
    var schema = CONTRACT[eventName];
    if (!schema || typeof root.gtag !== 'function') return false;
    var supplied = parameters && typeof parameters === 'object' ? parameters : {};
    var safe = {};
    for (var key in schema) {
      if (!Object.prototype.hasOwnProperty.call(supplied, key)) continue;
      if (!isAllowed(supplied[key], schema[key])) return false;
      safe[key] = supplied[key];
    }
    var required = Object.keys(schema).filter(function (key) {
      return !(eventName === 'cx_query_submit' && key === 'topic_id') &&
        !(eventName === 'cx_error' && (key === 'error_code' || key === 'error_status'));
    });
    if (required.some(function (key) { return !Object.prototype.hasOwnProperty.call(safe, key); })) return false;
    if (eventName === 'cx_query_submit' && safe.input_method === 'quick_topic' && !safe.topic_id) return false;
    if (eventName === 'cx_query_submit' && safe.input_method === 'manual') delete safe.topic_id;
    try {
      root.gtag('event', eventName, safe);
      return true;
    } catch (error) {
      return false;
    }
  }

  function destinationHost(value) {
    try { return new URL(value, root.location && root.location.href).hostname.toLowerCase(); }
    catch (error) { return ''; }
  }

  root.RentalAnalytics = Object.freeze({track: track, destinationHost: destinationHost});
})(window);
