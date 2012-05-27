module( "Built-in math operations" );

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