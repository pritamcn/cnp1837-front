/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cnp1837-api.developer24x7.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/ExpertSubscription",
        destination: "/PhysicianSubscription"
      },
      {
        source: "/Expert/dashboard",
        destination: "/Physician/dashboard"
      },
      {
        source: "/Expert/accountsettings",
        destination: "/Physician/accountsettings"
      },
      {
        source: "/Expert/accountsettings/calendar",
        destination: "/Physician/accountsettings/calendar"
      },
      {
        source: "/Expert/accountsettings/payment",
        destination: "/Physician/accountsettings/payment"
      },
      {
        source: "/Expert/calendar",
        destination: "/Physician/calendar"
      },
      {
        source: "/Expert/caserequest",
        destination: "/Physician/caserequest"
      },
      {
        source: "/Expert/caserequest/createcaserequest",
        destination: "/Physician/caserequest/createcaserequest"
      },
      {
        source: "/Expert/depositionrequests",
        destination: "/Physician/depositionrequests"
      },
      {
        source: "/Expert/depositionrequests/chat/:id",
        destination: "/Physician/depositionrequests/chat/:id"
      },
      {
        source: "/Expert/notificationmanagement",
        destination: "/Physician/notificationmanagement"
      },
      {
        source: "/Expert/paymenthistorymanagement",
        destination: "/Physician/paymenthistorymanagement"
      },
      {
        source: "/Expert/cancellationandrefund",
        destination: "/Physician/cancellationandrefund"
      },
      {
        source: "/AttorneyAssistantSubscription",
        destination: "/Subscription"
      },
      {
        source: "/AttorneyAssistant/dashboard",
        destination: "/Attorney/dashboard"
      },
      {
        source: "/AttorneyAssistant/accountsettings",
        destination: "/Attorney/accountsettings"
      },
      // {
      //   source: "/AttorneyAssistant/accountsettings/calendar",
      //   destination: "/Attorney/accountsettings/calendar"
      // },
      // {
      //   source: "/AttorneyAssistant/accountsettings/payment",
      //   destination: "/Attorney/accountsettings/payment"
      // },
      {
        source: "/AttorneyAssistant/calendar",
        destination: "/Attorney/calendar"
      },
      {
        source: "/AttorneyAssistant/cancellationandrefund",
        destination: "/Attorney/cancellationandrefund"
      },
      {
        source: "/AttorneyAssistant/casemanagement",
        destination: "/Attorney/casemanagement"
      },
      {
        source: "/AttorneyAssistant/casemanagement/casedetails/:id",
        destination: "/Attorney/casemanagement/casedetails/:id"
      },
      {
        source: "/AttorneyAssistant/casemanagement/createcase",
        destination: "/Attorney/casemanagement/createcase"
      },
      {
        source: "/AttorneyAssistant/casemanagement/editcase/:id",
        destination: "/Attorney/casemanagement/editcase/:id"
      },
      {
        source: "/AttorneyAssistant/caserequest",
        destination: "/Attorney/caserequest"
      },
      {
        source: "/AttorneyAssistant/dashboard",
        destination: "/Attorney/dashbaord"
      },
      {
        source: "/AttorneyAssistant/depositionmanagement",
        destination: "/Attorney/depositionmanagement"
      },
      {
        source: "/AttorneyAssistant/createdeposition/:id",
        destination: "/Attorney/createdeposition/:id"
      },
      {
        source: "/AttorneyAssistant/mydepositionlistmanagement",
        destination: "/Attorney/mydepositionlistmanagement"
      },
      {
        source: "/AttorneyAssistant/mydepositionlistmanagement/chat/:id",
        destination: "/Attorney/mydepositionlistmanagement/chat/:id",
      },
      {
        source: "/AttorneyAssistant/mydepositionlistmanagement/editdeposition/:id",
        destination: "/Attorney/mydepositionlistmanagement/editdeposition/:id",
      },
      {
        source: "/AttorneyAssistant/notificationmanagement",
        destination: "/Attorney/notificationmanagement",
      },
      {
        source: "/AttorneyAssistant/paymenthistorymanagement",
        destination: "/Attorney/paymenthistorymanagement",
      },
      {
        source: "/AttorneyAssistant/rescheduleandrefunds",
        destination: "/Attorney/rescheduleandrefunds",
      },
      {
        source: "/AttorneyAssistant/usermanagement",
        destination: "/Attorney/usermanagement",
      },
    ]
  }
}

module.exports = nextConfig
