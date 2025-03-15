const Service = require('../../models/services/Service');

// Create a new Service
exports.createService = async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();
        res.status(201).json(service);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Services
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find()
            .populate('manager')
            .populate('managerSuppression');
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a Service by ID
exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate('manager')
            .populate('managerSuppression');
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Service
exports.updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate('manager')
        .populate('managerSuppression');

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json(service);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a Service
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json({ message: 'Service deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};