import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import ExhibitorModel from '../../model/exhibitor.model';
import {
    deleteExhibitorInput,
} from '../../utils/validation/exhibitor.validation';
import NotFoundError from '../../errors/notFound.errors';
import badgeModel from '../../model/badge.model';
import associatedexhibitorsModel from '../../model/associatedexhibitors.model';
import attendantModel from '../../model/attendant.model';

// Delete Exhibitor
export const deleteBadge = asyncHandler(async (req: Request<deleteExhibitorInput>, res: Response) => {
    const response = await badgeModel.findById(req.params.id);
    if (!response) {
        throw new NotFoundError('Badge not found');
    }
    const assocate = await associatedexhibitorsModel.findById(response?.associatedInformation)
    const attendant = await attendantModel.findById(response?.attendantInformation)
    if (assocate) await assocate.deleteOne()
    if (attendant) await attendant.deleteOne()
    await response.deleteOne()

    res.status(200).json({
        message: 'Badge deleted successfully',
        success: true
    });
});


export const deleteRecordsByName =async(req:Request, res:Response) => {
  try {
    const names = req.body.names;

    // Validate input

    if (!Array.isArray(names) || names.length === 0) {
      return res.status(400).json({ error: 'Invalid input. Names must be provided as an array.' });
    }

    for (const name of names) {
      // Search in Attendant model
      const attendantRecords = await attendantModel.find({
        'attendeeInformation.fullName': name,
      });

      // Search in Associated model if not found in Attendant
      if (attendantRecords.length === 0) {
        const associatedRecords = await associatedexhibitorsModel.find({
          'attendeeInformation.fullName': name,
        });

        if (associatedRecords.length === 0) {
          console.log(`Records not found for name: ${name}`);
        } else {
          // Delete associatedRecords in Associated model and corresponding badges in Badge model
          for (const associatedRecord of associatedRecords) {
            await associatedexhibitorsModel.findByIdAndDelete(associatedRecord._id);
            await badgeModel.deleteMany({ associatedInformation: associatedRecord._id });
          }

          console.log(`Records and associated badges deleted for name: ${name}`);
        }
      } else {
        // Delete attendantRecords in Attendant model and corresponding badges in Badge model
        for (const attendantRecord of attendantRecords) {
          await attendantModel.findByIdAndDelete(attendantRecord._id);
          await badgeModel.deleteMany({ attendantInformation: attendantRecord._id });
        }

        console.log(`Records and associated badges deleted for name: ${name}`);
      }
    }

    return res.status(200).json({ message: 'Records and associated badges deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
;



// async function updatePaymentStatusForBurundi() {
//   try {
//     // Fetch attendants with country Burundi
//     const burundiAttendants = await AttendantModel.find({ 'companyInformation.country': 'Burundi' });

//     // Fetch exhibitors with country Burundi
//     const burundiExhibitors = await AssociatedModel.find({ 'country': 'Burundi' });

//     // Collect IDs of attendants and exhibitors
//     const attendantIds = burundiAttendants.map(attendant => attendant._id);
//     const exhibitorIds = burundiExhibitors.map(exhibitor => exhibitor._id);

//     // Find badges associated with attendants and exhibitors
//     const badgesToUpdate = await BadgeModel.find({
//       $or: [
//         { attendantInformation: { $in: attendantIds } },
//         { associatedInformation: { $in: exhibitorIds } }
//       ]
//     });

//     // Update paymentStatus to UNPAID for found badges
//     await BadgeModel.updateMany(
//       {
//         _id: { $in: badgesToUpdate.map(badge => badge._id) }
//       },
//       {
//         $set: { paymentStatus: "UNPAID" }
//       }
//     );

//     console.log("Payment status updated successfully for badges associated with Burundi.");

//   } catch (error) {
//     console.error("Error updating payment status:", error);
//   }
// }





