describe('Protractor Demo App', function() {
  it('should add one and two', function() {
    browser.get('http://localhost:8080/smart-opsboard/login');
    element(by.id('username')).sendKeys(1);
    element(by.id('password')).sendKeys(1);

    element(by.id('Login')).click();


	var setOption = function(id, ul_id, optionToSelect) {

	    var select = element(by.id(id));
	    select.click();

	    //element(by.id(ul_id))
		element.all(by.tagName('option'))
		    .filter(function(elem, index) {
		        return elem.getText().then(function(text) {
		            return text === optionToSelect;
		        });
		    }).then(function(filteredElements){
		        filteredElements[0].click();
		    });
	    
	    // element.all(by.tagName('option')).filter(function(elem, index) {
	    //     return elem.getText().then(function(text) {
	    //         return text === optionToSelect;
	    //     });
	    // }).then(function(filteredElements){
	    //     filteredElements[0].click();
	    // });
	};


	//workUnit, s2id_autogen1
	//setOption('s2id_autogen1', 'select2-results-2"', 'Brooklyn North Boro Office');
	setOption('select2-chosen-2', 'select2-results-2', 'Brooklyn North Boro Office');

	//s2id_autogen3
	//setOption('s2id_autogen3', 'select2-results-4', 'Brooklyn North Dist 1');
	setOption('select2-chosen-4', 'select2-results-4', 'Brooklyn North Dist 1');


    element(by.css('.btn.btn-default.btn-spin')).click();

    browser.driver.sleep(5000); 

  });
});