const HEADERS = [
  'timestamp',
  'q1_role',
  'q2_child_age',
  'q3_screen_time',
  'q4_concern_rating',
  'q5_content_types',
  'q6_screen_effects',
  'q7_first_reaction',
  'q8_resonance_rating',
  'q9_credibility_rating',
  'q10_current_spend',
  'q11_plan_choice',
  'q12_price_opinion',
  'q13_blockers',
  'q14_additive_worry_rating',
  'q15_must_get_right',
  'q16_concerns',
  'q17_nps',
  'q18_overall_verdict',
  'wants_trial',
  'trial_name',
  'trial_child_age',
  'trial_city',
  'trial_school',
  'trial_email',
  'trial_phone_prefix',
  'trial_phone'
];

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Write header row if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    }

    const data = JSON.parse(e.postData.contents);

    const row = HEADERS.map(function(h) {
      // Map header names back to the data keys collected by the form
      const keyMap = {
        timestamp:              'ts',
        q1_role:                'q1',
        q2_child_age:           'q2',
        q3_screen_time:         'q3',
        q4_concern_rating:      'q4',
        q5_content_types:       'q5',
        q6_screen_effects:      'q6',
        q7_first_reaction:      'q7',
        q8_resonance_rating:    'q8',
        q9_credibility_rating:  'q9',
        q10_current_spend:      'q10',
        q11_plan_choice:        'q11',
        q12_price_opinion:      'q12',
        q13_blockers:           'q13',
        q14_additive_worry_rating: 'q14',
        q15_must_get_right:     'q15',
        q16_concerns:           'q16',
        q17_nps:                'q17_nps',
        q18_overall_verdict:    'q18',
        wants_trial:            'wants_trial',
        trial_name:             'trial_name',
        trial_child_age:        'trial_child_age',
        trial_city:             'trial_city',
        trial_school:           'trial_school',
        trial_email:            'trial_email',
        trial_phone_prefix:     'trial_phone_prefix',
        trial_phone:            'trial_phone'
      };
      const key = keyMap[h] || h;
      const val = data[key];
      if (Array.isArray(val)) return val.join(', ');
      return (val !== undefined && val !== null) ? val : '';
    });

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test this by running it manually in the Apps Script editor
function testSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  Logger.log('Sheet name: ' + sheet.getName());
  Logger.log('Rows so far: ' + sheet.getLastRow());
}
