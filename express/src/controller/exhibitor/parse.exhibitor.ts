export const parseCSVExhibitorData = (csvData) => {
    // Splitting lines and headers
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',');

    // Parsing each line
    const result = lines.slice(1).map((line) => {
        const values = line.split(',');

        // const fullName = values[4] || 'TBC'; // Assuming Full Name is at index 4

        // // Separate full name into firstName and lastName
        // const [firstName, ...lastNameArr] = fullName.split(' ');
        // const lastName = lastNameArr.join(' ');

        return {
            companyInformation: {
                companyName: values[0] || 'TBC', // Assuming Company Name is at index 1
                country: 'TBC',
            },
            representativeInformation: {
                firstName:  'TBC',
                lastName:  'TBC',
                email:  'TBC',       // Assuming Representative Email is at index 5
                phoneNumber: 'TBC',
            },
            boothType: values[1] || 'TBC' ,  // Assuming Booth Type is at index 2
        };
    });

    return result;
};
