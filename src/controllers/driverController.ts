import { Request, Response } from "express";
import { Driver } from "../models/driverModel";

export const getDrivers = async (req: Request, res: Response) => {
  try {
    const search = req.query.search;

    // Haal de coureurs op, met of zonder zoekopdracht
    const drivers = search
      ? await Driver.find({
          givenName: { $regex: new RegExp(search as string, "i") },
        })
      : await Driver.find();

    // Voeg de vlag-URL toe voor elke coureur
    const driversWithFlags = drivers.map((driver) => {
      // Genereer de vlag-URL op basis van de countryCode
      const flagUrl = `https://purecatamphetamine.github.io/country-flag-icons/3x2/${driver.countryCode}.svg`;

      // Retourneer de gegevens met de vlag-URL
      return {
        ...driver.toObject(), // Maak een object van de driver
        country_flag: flagUrl, // Voeg de country_flag toe
      };
    });

    // Stuur de aangepaste gegevens terug in de response
    res.status(200).json({ status: "success", data: driversWithFlags });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

// Create a driver
export const createDriver = async (req: Request, res: Response) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();
    res.status(201).json({ status: "success", data: driver });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};
