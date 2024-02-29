export const parseCSVData = (csvData) => {
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',');

    const result = lines.slice(1).map((line) => {
        const values = line.split(',');
        // console.log(values)

        const attendeeData = {
            companyInformation: {
                companyName: values[2] || 'TBC', // Assuming Company Name is at index 2
                country: values[4] || 'TBC',    // Assuming Country is at index 4
                city: 'TBC',
                Position: values[13] || 'TBC',
            },
            attendeeInfo: {
                fullName: values[1] || 'TBC',  // Assuming Delegate Name is at index
                nationality: values[4] || 'TBC',
                email: values[5] || 'TBC',       // Assuming Email is at index 5
                phoneNumber: 'TBC',
                Position: values[13] || 'TBC',

            },
            sideActivity: headers.slice(7).filter((header, index) => values[index + 7] === 'Yes'),
            isMember: values[3] === 'Yes', // Assuming Member is at index 3
            badgeType: values[6] || 'TBC',  // Assuming Badge Type is at index 6

        };

        return attendeeData;
    });

    return result;
};
