module( "Built-in math operations" );

var one 		= new Value(VAL_NUM, 1),
	two 		= new Value(VAL_NUM, 2),
	three 		= new Value(VAL_NUM, 3),
	four 		= new Value(VAL_NUM, 4),
	five 		= new Value(VAL_NUM, 5),
	six 		= new Value(VAL_NUM, 6),
	seven 		= new Value(VAL_NUM, 7),
	eight 		= new Value(VAL_NUM, 8),
	nine 		= new Value(VAL_NUM, 9),
	ten 		= new Value(VAL_NUM, 10),

	m_one 		= new Value(VAL_NUM, -1),
	m_two 		= new Value(VAL_NUM, -2),
	m_three 	= new Value(VAL_NUM, -3),
	m_four 		= new Value(VAL_NUM, -4),
	m_five 		= new Value(VAL_NUM, -5),
	m_six 		= new Value(VAL_NUM, -6),
	m_seven 	= new Value(VAL_NUM, -7),
	m_eight 	= new Value(VAL_NUM, -8),
	m_nine 		= new Value(VAL_NUM, -9),
	m_ten 		= new Value(VAL_NUM, -10),

	s_one		= new Value(VAL_WORD, '1');
	s_two		= new Value(VAL_WORD, '2');
	s_three		= new Value(VAL_WORD, '3');
	s_four 		= new Value(VAL_WORD, '4');
	s_five 		= new Value(VAL_WORD, '5');
	s_six 		= new Value(VAL_WORD, '6');
	s_seven		= new Value(VAL_WORD, '7');
	s_eight		= new Value(VAL_WORD, '8');
	s_nine		= new Value(VAL_WORD, '9');
	s_ten		= new Value(VAL_WORD, '10');

	sm_one		= new Value(VAL_WORD, '-1');
	sm_two		= new Value(VAL_WORD, '-2');
	sm_three	= new Value(VAL_WORD, '-3');
	sm_four		= new Value(VAL_WORD, '-4');
	sm_five		= new Value(VAL_WORD, '-5');
	sm_six		= new Value(VAL_WORD, '-6');
	sm_seven	= new Value(VAL_WORD, '-7');
	sm_eight	= new Value(VAL_WORD, '-8');
	sm_nine		= new Value(VAL_WORD, '-9');
	sm_ten		= new Value(VAL_WORD, '-10');


	lorem 	= new Value(VAL_WORD, 'lorem'),
	ipsum 	= new Value(VAL_WORD, 'ipsum'),
	dolor 	= new Value(VAL_WORD, 'dolor'),
	sit 	= new Value(VAL_WORD, 'sit'),
	amet 	= new Value(VAL_WORD, 'amet');

test( "sum", function() {
	raises( function() { funExecutor.execute('sum', []) }, 'INVALID_ARGUMENT_COUNT', "sum shall not be able to be called with 0 inputs" );
	raises( function() { funExecutor.execute('sum', [one]) }, 'INVALID_ARGUMENT_COUNT', "sum shall not be able to be called with 1 number input" );
	raises( function() { funExecutor.execute('sum', [lorem]) }, 'INVALID_ARGUMENT_COUNT', "sum shall not be able to be called with 1 word input" );
	raises( function() { funExecutor.execute('sum', [lorem, ipsum]) }, 'INVALID_INPUT_TYPE', "sum shall not be able to be called with 2 word inputs" );
	raises( function() { funExecutor.execute('sum', [lorem, one]) }, 'INVALID_INPUT_TYPE', "sum shall not be able to be called with 1 word and 1 number input" );
	raises( function() { funExecutor.execute('sum', [one, lorem]) } , 'INVALID_INPUT_TYPE', "sum shall not be able to be called with 1 number and 1 word input" );

	deepEqual( funExecutor.execute('sum', [one, two]), three, "sum of 1 and 2 should be 3" );
	deepEqual( funExecutor.execute('sum', [m_one, m_two]), m_three, "sum of -1 and -2 should be -3" );
	deepEqual( funExecutor.execute('sum', [four, five]), nine, "sum of 4 and 5 should be 9" );
	deepEqual( funExecutor.execute('sum', [m_four, m_five]), m_nine, "sum of -4 and -5 should be -9" );

	deepEqual( funExecutor.execute('sum', [s_one, s_two]), three, 'sum of "1 and "2 should be 3' );
	deepEqual( funExecutor.execute('sum', [sm_one, sm_two]), m_three, 'sum of "-1 and "-2 should be -3' );
	deepEqual( funExecutor.execute('sum', [s_four, s_five]), nine, 'sum of "4 and "5 should be 9' );
	deepEqual( funExecutor.execute('sum', [sm_four, sm_five]), m_nine, 'sum of "-4 and "-5 should be -9' );	
} );

test( "difference", function() {
	raises( function() { funExecutor.execute('difference', []) }, 'INVALID_ARGUMENT_COUNT', "difference shall not be able to be called with 0 inputs" );
	raises( function() { funExecutor.execute('differenceum', [one]) }, 'INVALID_ARGUMENT_COUNT', "difference shall not be able to be called with 1 number input" );
	raises( function() { funExecutor.execute('difference', [lorem]) }, 'INVALID_ARGUMENT_COUNT', "difference shall not be able to be called with 1 word input" );
	raises( function() { funExecutor.execute('difference', [lorem, ipsum]) }, 'INVALID_INPUT_TYPE', "difference shall not be able to be called with 2 word inputs" );
	raises( function() { funExecutor.execute('difference', [lorem, one]) }, 'INVALID_INPUT_TYPE', "difference shall not be able to be called with 1 word and 1 number input" );
	raises( function() { funExecutor.execute('difference', [one, lorem]) } , 'INVALID_INPUT_TYPE', "difference shall not be able to be called with 1 number and 1 word input" );

	deepEqual( funExecutor.execute('difference', [three, two]), one, "difference of 3 and 2 should be 1" );
	deepEqual( funExecutor.execute('difference', [m_one, m_two]), one, "difference of -1 and -2 should be 1" );
	deepEqual( funExecutor.execute('difference', [four, five]), m_one, "difference of 4 and 5 should be -1" );
	deepEqual( funExecutor.execute('difference', [m_four, five]), m_nine, "difference of -4 and 5 should be -9" );

	deepEqual( funExecutor.execute('difference', [s_three, s_two]), one, 'difference of "1 and "2 should be 3' );
	deepEqual( funExecutor.execute('difference', [sm_one, sm_two]), one, 'difference of "-1 and "-2 should be 1' );
	deepEqual( funExecutor.execute('difference', [s_four, s_five]), m_one, 'difference of "4 and "5 should be 9' );
	deepEqual( funExecutor.execute('difference', [sm_four, s_five]), m_nine, 'difference of "-4 and "5 should be -9' );	
} );